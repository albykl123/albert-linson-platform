import fs from 'fs';
import path from 'path';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

console.log('--- Cloudflare Resource Provisioning & Verification ---');
if (!accountId || !apiToken) {
  console.log('Skipping API checks: CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN missing.');
  process.exit(0);
}

console.log(`Using Cloudflare Account: ${accountId.substring(0, 6)}...`);

const headers = {
  Authorization: `Bearer ${apiToken}`,
  'Content-Type': 'application/json',
};

async function verifyAuthAndWorkersApi() {
  console.log('Verifying Cloudflare API Token & Account access...');
  try {
    const tokenRes = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', { headers });
    const tokenData = await tokenRes.json();
    console.log('[Auth] Token status:', tokenData.success ? `Active (Status: ${tokenData.result?.status})` : JSON.stringify(tokenData.errors));

    const subRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, { headers });
    const subData = await subRes.json();
    if (subData.success && subData.result?.subdomain) {
      console.log(`[Workers] Verified registered subdomain: ${subData.result.subdomain}.workers.dev`);
    } else {
      console.warn('[Workers] Subdomain query response:', JSON.stringify(subData));
    }

    const svcRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/services/albert-linson-platform`, { headers });
    console.log(`[Workers] Worker service endpoint check: HTTP ${svcRes.status} (${svcRes.statusText})`);
    if (svcRes.status === 503) {
      console.warn('[Workers] Cloudflare Workers API returned 503 Service Unavailable (upstream gateway latency). Waiting 15s...');
      await new Promise((r) => setTimeout(r, 15000));
    }
  } catch (err) {
    console.warn('[Auth/Workers] Pre-flight check warning:', err.message);
  }
}

async function getOrProvisionD1() {
  console.log('Inspecting Cloudflare D1 database: albert-linson-db...');
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`, {
      headers,
    });
    const data = await res.json();
    let dbUuid = null;

    if (data.success && Array.isArray(data.result)) {
      const existing = data.result.find((d) => d.name === 'albert-linson-db');
      if (existing) {
        dbUuid = existing.uuid;
        console.log(`[D1] Matched existing database 'albert-linson-db' with UUID: ${dbUuid}`);
      }
    }

    if (!dbUuid) {
      console.log("[D1] Database not found. Creating 'albert-linson-db'...");
      const createRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: 'albert-linson-db' }),
      });
      const createData = await createRes.json();
      if (createData.success && createData.result && createData.result.uuid) {
        dbUuid = createData.result.uuid;
        console.log(`[D1] Successfully created database with UUID: ${dbUuid}`);
      } else {
        console.warn('[D1] Create response:', JSON.stringify(createData));
      }
    }

    if (dbUuid) {
      updateWranglerD1Uuid(dbUuid);
    } else {
      console.warn('[D1] Could not resolve database UUID. Keeping existing configuration.');
    }
  } catch (err) {
    console.error('[D1] Verification encountered an error:', err);
  }
}

function updateWranglerD1Uuid(uuid) {
  const candidates = [
    path.resolve(process.cwd(), 'wrangler.toml'),
    path.resolve(process.cwd(), 'apps/web/wrangler.toml'),
    path.resolve(process.cwd(), '../../apps/web/wrangler.toml'),
    path.resolve(process.cwd(), '../../wrangler.toml'),
    path.resolve(process.cwd(), '../wrangler.toml'),
  ];
  for (const tomlPath of candidates) {
    if (fs.existsSync(tomlPath)) {
      let content = fs.readFileSync(tomlPath, 'utf8');
      content = content.replace(/database_id\s*=\s*"[^"]*"/g, `database_id = "${uuid}"`);
      fs.writeFileSync(tomlPath, content, 'utf8');
      console.log(`[D1] Updated database_id = "${uuid}" in ${tomlPath}`);
    }
  }
}

async function verifyOrHandleR2() {
  console.log('Inspecting Cloudflare R2 bucket: albert-linson-resumes...');
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`, {
      headers,
    });
    const data = await res.json();
    if (data.success) {
      console.log('[R2] R2 service is active on this Cloudflare account.');
      const buckets = data.result?.buckets || [];
      const existing = buckets.find((b) => b.name === 'albert-linson-resumes');
      if (!existing) {
        console.log("[R2] Creating bucket 'albert-linson-resumes'...");
        const createRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: 'albert-linson-resumes' }),
        });
        const createData = await createRes.json();
        console.log('[R2] Bucket creation result:', createData.success ? 'Success' : JSON.stringify(createData));
      } else {
        console.log("[R2] Bucket 'albert-linson-resumes' exists and is ready.");
      }
    } else {
      const code = data.errors?.[0]?.code;
      console.warn(`[R2] R2 is not active on this account (API error ${code}: ${data.errors?.[0]?.message}).`);
      console.log('[R2] Commenting out [[r2_buckets]] binding to ensure worker deployment proceeds without blocking.');
      removeR2Binding();
    }
  } catch (err) {
    console.warn('[R2] Verification failed, maintaining default configuration:', err);
  }
}

function removeR2Binding() {
  const candidates = [
    path.resolve(process.cwd(), 'wrangler.toml'),
    path.resolve(process.cwd(), 'apps/web/wrangler.toml'),
    path.resolve(process.cwd(), '../../apps/web/wrangler.toml'),
    path.resolve(process.cwd(), '../../wrangler.toml'),
    path.resolve(process.cwd(), '../wrangler.toml'),
  ];
  for (const tomlPath of candidates) {
    if (fs.existsSync(tomlPath)) {
      let content = fs.readFileSync(tomlPath, 'utf8');
      // Comment out [[r2_buckets]] block
      content = content.replace(
        /\[\[r2_buckets\]\]\r?\n\s*binding\s*=\s*"RESUME_STORAGE"\r?\n\s*bucket_name\s*=\s*"albert-linson-resumes"/g,
        '# [[r2_buckets]]\n# binding = "RESUME_STORAGE"\n# bucket_name = "albert-linson-resumes"'
      );
      fs.writeFileSync(tomlPath, content, 'utf8');
      console.log(`[R2] Safely disabled R2 binding in ${tomlPath}`);
    }
  }
}

async function syncWorkerSecrets() {
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (secretKey) {
    try {
      console.log('[Security] Syncing encrypted ADMIN_SECRET_KEY to Cloudflare Worker...');
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/albert-linson-platform/secrets`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: 'ADMIN_SECRET_KEY',
          text: secretKey.trim(),
          type: 'secret_text',
        }),
      });
      const data = await res.json();
      if (data.success) {
        console.log('[Security] Successfully updated Cloudflare Worker secret: ADMIN_SECRET_KEY');
      } else {
        console.warn('[Security] Secret sync notice (ADMIN_SECRET_KEY):', JSON.stringify(data.errors || data));
      }
    } catch (err) {
      console.warn('[Security] Secret sync warning (ADMIN_SECRET_KEY):', err.message);
    }
  } else {
    console.log('[Security] Skipping Worker secret update: ADMIN_SECRET_KEY not in env.');
  }

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    try {
      console.log('[Security] Syncing encrypted OPENROUTER_API_KEY to Cloudflare Worker...');
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/albert-linson-platform/secrets`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: 'OPENROUTER_API_KEY',
          text: openrouterKey.trim(),
          type: 'secret_text',
        }),
      });
      const data = await res.json();
      if (data.success) {
        console.log('[Security] Successfully updated Cloudflare Worker secret: OPENROUTER_API_KEY');
      } else {
        console.warn('[Security] Secret sync notice (OPENROUTER_API_KEY):', JSON.stringify(data.errors || data));
      }
    } catch (err) {
      console.warn('[Security] Secret sync warning (OPENROUTER_API_KEY):', err.message);
    }
  }
}

async function main() {
  await verifyAuthAndWorkersApi();
  await syncWorkerSecrets();
  await getOrProvisionD1();
  await verifyOrHandleR2();
  console.log('--- Cloudflare Resource Provisioning & Verification Finished ---');
}

main();
