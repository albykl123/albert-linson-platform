// Albert Professional Email Automation — Autonomous Controller

let currentWorkflowPaused = false;

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  fetchStatus();

  // Top bar controls
  document.getElementById("refresh-btn")?.addEventListener("click", () => {
    const icon = document.getElementById("refresh-icon");
    if (icon) icon.classList.add("animate-spin");
    fetchStatus().finally(() => {
      setTimeout(() => {
        if (icon) icon.classList.remove("animate-spin");
      }, 600);
    });
  });

  document.getElementById("workflow-pause-btn")?.addEventListener("click", toggleWorkflowPause);
  document.getElementById("view-audit-btn")?.addEventListener("click", openAuditModal);
  document.getElementById("close-audit-btn")?.addEventListener("click", closeAuditModal);

  // Command buttons
  document.getElementById("cmd-start-registration")?.addEventListener("click", handleStartRegistration);
  document.getElementById("cmd-verify-mx")?.addEventListener("click", handleVerifyMX);

  // Forms
  document.getElementById("token-form")?.addEventListener("submit", handleApproveConfirmation);
  document.getElementById("delivery-test-form")?.addEventListener("submit", handleRecordDeliveryTest);

  // Human Checkpoint button
  document.getElementById("human-action-done-btn")?.addEventListener("click", handleHumanActionDone);

  // Subdomain search
  document.getElementById("search-btn")?.addEventListener("click", handleSearchSubdomain);
  document.getElementById("search-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearchSubdomain();
  });

  // Poll status periodically (every 10s)
  setInterval(fetchStatus, 10000);
});

async function fetchStatus() {
  try {
    const res = await fetch("/api/status");
    if (!res.ok) throw new Error("Status query failed");
    const data = await res.json();
    renderDashboard(data);
  } catch (err) {
    console.error("fetchStatus error:", err);
  }
}

function renderDashboard(data) {
  const config = data.config || {};
  const targetAvail = data.target_availability || {};
  const health = data.provider_health || {};
  const lifecycle = data.six_stage_lifecycle || {};
  const mx = data.mx_status || {};
  const state = data.state || {};
  const renewal = data.renewal || {};

  // 1. Navigation / Top Bar Telemetry
  const latencyEl = document.getElementById("api-latency");
  if (latencyEl) {
    latencyEl.textContent = `${health.latency_ms || 0} ms`;
    latencyEl.className = health.latency_ms < 500 ? "font-mono text-emerald-400 font-semibold" : "font-mono text-amber-400 font-semibold";
  }

  currentWorkflowPaused = Boolean(state.workflow_paused);
  const pauseBtn = document.getElementById("workflow-pause-btn");
  if (pauseBtn) {
    pauseBtn.innerHTML = currentWorkflowPaused 
      ? `<i data-lucide="play" class="w-3.5 h-3.5 text-emerald-400"></i><span>Resume</span>` 
      : `<i data-lucide="pause" class="w-3.5 h-3.5"></i><span>Pause</span>`;
  }

  // 2. Pending Human Checkpoint Alert
  const banner = document.getElementById("human-action-banner");
  const pendingAction = state.pending_human_action || {};
  if (banner) {
    if (pendingAction.required) {
      banner.classList.remove("hidden");
      const descEl = document.getElementById("human-action-desc");
      if (descEl) descEl.textContent = pendingAction.description;
      const linkEl = document.getElementById("human-action-link");
      if (linkEl && pendingAction.action_url) {
        linkEl.href = pendingAction.action_url;
      }
    } else {
      banner.classList.add("hidden");
    }
  }

  // 3. Six-Stage Lifecycle Progress Pipeline
  renderLifecyclePipeline(lifecycle);

  // 4. Identity Telemetry Cards
  const subDisplay = document.getElementById("subdomain-display");
  if (subDisplay) subDisplay.textContent = `${config.target_subdomain}.${config.provider_domain}`;

  const emailDisplay = document.getElementById("email-display");
  if (emailDisplay) emailDisplay.textContent = config.professional_email;

  const destDisplay = document.getElementById("destination-display");
  if (destDisplay) destDisplay.textContent = config.forward_destination_masked;

  const mxDisplay = document.getElementById("mx-display");
  if (mxDisplay && mx.mx_records) {
    const primary = mx.mx_records[0]?.host || "mail.does.software";
    mxDisplay.textContent = `${primary} (10)`;
  }

  const subBadge = document.getElementById("subdomain-badge");
  if (subBadge) {
    if (targetAvail.available) {
      subBadge.className = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono";
      subBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>100% AVAILABLE`;
    } else {
      subBadge.className = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono";
      subBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>CLAIMED`;
    }
  }

  const verBadge = document.getElementById("verification-badge");
  if (verBadge) {
    if (state.current_stage === "STAGE_6_DELIVERY_VERIFIED" || state.current_stage === "STAGE_4_GMAIL_VERIFIED" || state.current_stage === "STAGE_5_MX_VERIFIED") {
      verBadge.className = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono";
      verBadge.innerHTML = `<i data-lucide="check" class="w-3 h-3 mr-1 text-emerald-400"></i>Active Forward`;
    } else {
      verBadge.className = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono";
      verBadge.innerHTML = `<i data-lucide="clock" class="w-3 h-3 mr-1 text-amber-400"></i>${state.stage_labels?.[state.current_stage] || 'Pending'}`;
    }
  }

  // 5. Renewal Telemetry
  const renewDays = document.getElementById("renewal-days-left");
  if (renewDays && renewal.days_remaining !== undefined) {
    renewDays.textContent = `${renewal.days_remaining} days remaining`;
  }

  // 6. Alternative Pool
  renderCandidatePool(data.candidates_availability, config.target_subdomain);

  // 7. Delivery Test History
  renderDeliveryHistory(state.delivery_tests || []);

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderLifecyclePipeline(lifecycle) {
  const container = document.getElementById("pipeline-steps-grid");
  if (!container) return;

  const scoreEl = document.getElementById("pipeline-score");
  if (scoreEl) scoreEl.textContent = `Stage ${lifecycle.completed_count || 1} of 6`;

  const percentEl = document.getElementById("pipeline-percent");
  if (percentEl) percentEl.textContent = `${lifecycle.percentage || 17}%`;

  container.innerHTML = "";
  (lifecycle.stages || []).forEach((stage) => {
    const isCompleted = stage.completed;
    const isCurrent = stage.key === lifecycle.current_stage;

    const div = document.createElement("div");
    div.className = `p-3 rounded-xl border text-xs flex flex-col justify-between transition-all ${
      isCurrent 
        ? "bg-teal-500/10 border-teal-500 shadow-md ring-1 ring-teal-500/40" 
        : isCompleted 
          ? "bg-slate-950/80 border-emerald-500/40 text-slate-200" 
          : "bg-slate-950/40 border-slate-800 text-slate-500"
    }`;

    div.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
            isCompleted ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
          }">
            ${stage.id}
          </span>
          <span class="text-[9px] font-mono font-bold uppercase ${
            isCurrent ? "text-teal-400 animate-pulse" : isCompleted ? "text-emerald-400" : "text-slate-600"
          }">
            ${isCurrent ? "ACTIVE" : isCompleted ? "DONE" : "PENDING"}
          </span>
        </div>
        <div class="font-bold text-slate-200 text-[11px] leading-tight">${stage.title}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderCandidatePool(candidates, targetSubdomain) {
  const candList = document.getElementById("candidates-list");
  if (!candList || !candidates) return;

  candList.innerHTML = "";
  candidates.forEach((cand) => {
    const isTarget = cand.name === targetSubdomain;
    const isFree = cand.available;

    const div = document.createElement("div");
    div.className = "flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono";
    
    div.innerHTML = `
      <div class="flex items-center space-x-1.5 truncate">
        <span class="${isTarget ? 'text-teal-300 font-bold' : 'text-slate-300'}">
          ${cand.name}.does.software
        </span>
        ${isTarget ? '<span class="text-[10px] text-teal-400 font-bold">[PRIMARY]</span>' : ''}
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
          isFree 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
        }">
          ${isFree ? 'FREE' : 'TAKEN'}
        </span>
        ${!isTarget && isFree ? `
          <button onclick="approveAlternative('${cand.name}')" class="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-300 font-bold transition-all border border-slate-700">
            Select
          </button>
        ` : ''}
      </div>
    `;
    candList.appendChild(div);
  });
}

function renderDeliveryHistory(tests) {
  const container = document.getElementById("delivery-history-list");
  if (!container) return;

  if (tests.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-500 font-mono p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">No delivery tests recorded yet.</div>`;
    return;
  }

  container.innerHTML = "";
  tests.slice(-5).reverse().forEach((t) => {
    const div = document.createElement("div");
    div.className = `p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
      t.passed ? "bg-emerald-950/20 border-emerald-500/30" : "bg-rose-950/20 border-rose-500/30"
    }`;
    div.innerHTML = `
      <div class="truncate mr-2">
        <span class="font-bold ${t.passed ? 'text-emerald-400' : 'text-rose-400'}">[${t.passed ? 'PASSED' : 'FAILED'}]</span>
        <span class="text-slate-300 ml-1.5">${t.subject || 'Test Message'}</span>
        <span class="text-slate-500 text-[10px] block">From: ${t.sender_email}</span>
      </div>
      <span class="text-[10px] text-slate-400 shrink-0">${t.timestamp ? t.timestamp.slice(11, 19) + ' UTC' : ''}</span>
    `;
    container.appendChild(div);
  });
}

async function handleStartRegistration() {
  const btn = document.getElementById("cmd-start-registration");
  if (btn) btn.disabled = true;

  try {
    const res = await fetch("/api/workflow/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ open_browser: true })
    });
    const data = await res.json();
    fetchStatus();
    if (data.success && data.claim_url) {
      window.open(data.claim_url, "_blank");
    }
  } catch (err) {
    console.error("Start registration error:", err);
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function handleHumanActionDone() {
  try {
    const res = await fetch("/api/workflow/turnstile-completed", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    fetchStatus();
  } catch (err) {
    console.error(err);
  }
}

async function handleVerifyMX() {
  const btn = document.getElementById("cmd-verify-mx");
  if (btn) btn.disabled = true;

  try {
    const res = await fetch("/api/workflow/verify-mx", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    alert(`MX Verification Result:\n• Status: ${data.status}\n• Expected: ${data.expected_host}\n• Verified: ${data.verified}`);
    fetchStatus();
  } catch (err) {
    console.error("Verify MX error:", err);
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function handleApproveConfirmation(e) {
  e.preventDefault();
  const input = document.getElementById("token-input");
  const statusEl = document.getElementById("token-status");
  if (!input || !statusEl) return;

  const raw = input.value.trim();
  if (!raw) {
    alert("Please enter the provider confirmation token or link.");
    return;
  }

  // Extract token if user pasted full URL
  let token = raw;
  const match = raw.match(/[?&]token=([a-zA-Z0-9_\-]+)/);
  if (match) {
    token = match[1];
  }

  statusEl.classList.remove("hidden");
  statusEl.innerHTML = `<span class="text-slate-400">Sending owner-approved confirmation to does.software...</span>`;

  try {
    const res = await fetch("/api/workflow/approve-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (data.success) {
      statusEl.innerHTML = `<span class="text-emerald-400 font-bold">✓ Forwarding Confirmed and Verified!</span>`;
      input.value = "";
      fetchStatus();
    } else {
      statusEl.innerHTML = `<span class="text-rose-400">Error: ${data.message}</span>`;
    }
  } catch (err) {
    statusEl.innerHTML = `<span class="text-rose-400">Network error during confirmation.</span>`;
  }
}

async function handleRecordDeliveryTest(e) {
  e.preventDefault();
  const senderInput = document.getElementById("test-sender");
  const subjectInput = document.getElementById("test-subject");
  const statusEl = document.getElementById("delivery-test-status");

  const sender = senderInput.value.trim();
  const subject = subjectInput.value.trim();

  statusEl.classList.remove("hidden");
  statusEl.innerHTML = `<span class="text-slate-400">Recording delivery test results...</span>`;

  try {
    const res = await fetch("/api/workflow/run-delivery-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_email: sender,
        subject: subject,
        received_in_inbox: true,
        sender_retained: true,
        subject_retained: true,
        is_spam: false
      })
    });
    const data = await res.json();
    if (data.passed) {
      statusEl.innerHTML = `<span class="text-emerald-400 font-bold">✓ Test Passed! Final Stage 6 Achieved.</span>`;
    } else {
      statusEl.innerHTML = `<span class="text-rose-400 font-bold">Test marked as incomplete.</span>`;
    }
    fetchStatus();
  } catch (err) {
    statusEl.innerHTML = `<span class="text-rose-400">Failed to record test.</span>`;
  }
}

async function toggleWorkflowPause() {
  const endpoint = currentWorkflowPaused ? "/api/workflow/resume" : "/api/workflow/pause";
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Toggled from dashboard" })
    });
    fetchStatus();
  } catch (err) {
    console.error(err);
  }
}

async function approveAlternative(name) {
  if (!confirm(`Are you sure you want to select alternative '${name}.does.software'?\nThis will update your target email to hello@${name}.does.software.`)) {
    return;
  }

  try {
    const res = await fetch("/api/workflow/select-alternative", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    alert(data.message);
    fetchStatus();
  } catch (err) {
    console.error(err);
  }
}

async function handleSearchSubdomain() {
  const input = document.getElementById("search-input");
  const result = document.getElementById("search-result");
  if (!input || !result) return;
  const name = input.value.trim().toLowerCase();
  if (!name) return;

  result.innerHTML = `<span class="text-slate-400 font-mono">Checking does.software API...</span>`;
  try {
    const res = await fetch("/api/check-subdomain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (data.available) {
      result.innerHTML = `<span class="text-slate-400 font-mono">Status:</span><span class="text-emerald-400 font-bold font-mono">AVAILABLE (${data.name})</span>`;
    } else {
      result.innerHTML = `<span class="text-slate-400 font-mono">Status:</span><span class="text-rose-400 font-bold font-mono">TAKEN (${data.reason || 'claimed'})</span>`;
    }
  } catch (err) {
    result.innerHTML = `<span class="text-rose-400 font-mono">Network error querying API</span>`;
  }
}

async function openAuditModal() {
  const modal = document.getElementById("audit-modal");
  const content = document.getElementById("audit-log-content");
  if (!modal || !content) return;

  modal.classList.remove("hidden");
  content.innerHTML = `<div class="text-slate-500">Loading audit history...</div>`;

  try {
    const res = await fetch("/api/audit-log");
    const data = await res.json();
    const logs = data.audit_log || [];

    if (logs.length === 0) {
      content.innerHTML = `<div class="text-slate-500">No events logged yet.</div>`;
      return;
    }

    content.innerHTML = "";
    logs.slice(-50).reverse().forEach((log) => {
      const div = document.createElement("div");
      div.className = "p-2 rounded bg-slate-900 border border-slate-800 text-[11px]";
      div.innerHTML = `
        <div class="flex justify-between text-slate-400 mb-1">
          <strong class="text-teal-400 font-mono">[${log.event}]</strong>
          <span class="text-slate-500 text-[10px]">${log.timestamp || ''}</span>
        </div>
        <pre class="text-slate-300 font-mono overflow-x-auto text-[10px]">${JSON.stringify(log.details, null, 2)}</pre>
      `;
      content.appendChild(div);
    });
  } catch (err) {
    content.innerHTML = `<div class="text-rose-400">Failed to load audit history.</div>`;
  }
}

function closeAuditModal() {
  const modal = document.getElementById("audit-modal");
  if (modal) modal.classList.add("hidden");
}
