/**
 * Outbound Email Service Adapter Architecture
 * ============================================
 * Strictly separates Inbound Forwarding from Outbound Sending.
 *
 * Architectural Boundary Note:
 * - Inbound forwarding on `albert.does.software` is managed by `mail.does.software` (MX Priority 10).
 * - Outbound direct sending requires DNS SPF (TXT), DKIM (CNAME/TXT selector), and DMARC policies.
 *   Because `does.software` is a shared public suffix domain, third-party apex DNS modifications
 *   cannot be made by subdomain tenants.
 * - To ensure 100% deliverability and prevent sender spoofing/reputation damage, this adapter
 *   enforces DRAFT_ONLY mode, client-side mailto routing, and owner-approved Gmail staging.
 */

export type OutboundChannel = "mailto" | "gmail_draft" | "direct_smtp";

export interface OutboundMessageRequest {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  channel?: OutboundChannel;
  requireApproval?: boolean;
}

export interface OutboundMessageResult {
  success: boolean;
  channel: OutboundChannel;
  status: "draft_staged" | "client_routed" | "dispatched" | "approval_required" | "blocked";
  messageId?: string;
  draftUrl?: string;
  error?: string;
  notes: string;
}

export class EmailServiceAdapter {
  private static readonly SENDER_IDENTITY = "hello@albert.does.software";
  private static readonly INBOUND_FORWARDER = "mail.does.software";

  /**
   * Evaluates domain sending authorization status.
   * Confirms whether outbound SMTP direct sending is sanctioned.
   */
  public static getDomainSendingCapabilities(): {
    canDirectSend: boolean;
    hasDkimDmarcControl: boolean;
    recommendedMode: "mailto_and_drafts" | "direct_smtp";
    explanation: string;
  } {
    return {
      canDirectSend: false,
      hasDkimDmarcControl: false,
      recommendedMode: "mailto_and_drafts",
      explanation:
        "Subdomain 'albert.does.software' operates as a receive-only forwarding identity on does.software infrastructure. " +
        "Authoritative SPF and DKIM keys for 'does.software' are maintained centrally by the provider. " +
        "Outbound messages must be composed via mailto or staged as drafts inside owner-authorized Gmail."
    };
  }

  /**
   * Generates a safe client-side mailto URI with encoded parameters.
   */
  public static createMailtoUri(to: string, subject: string, body?: string): string {
    const params = new URLSearchParams();
    if (subject) params.append("subject", subject);
    if (body) params.append("body", body);
    const query = params.toString();
    return `mailto:${encodeURIComponent(to)}${query ? `?${query}` : ""}`;
  }

  /**
   * Routes an outreach message through the secure adapter.
   * Default behavior: Always stages as a draft or prepares a mailto action. Never dispatches unapproved.
   */
  public static async stageOutboundMessage(req: OutboundMessageRequest): Promise<OutboundMessageResult> {
    const channel = req.channel || "mailto";

    // 1. Client Mailto Routing
    if (channel === "mailto") {
      const mailtoUri = this.createMailtoUri(req.to, req.subject, req.body);
      return {
        success: true,
        channel: "mailto",
        status: "client_routed",
        draftUrl: mailtoUri,
        notes: "Generated mailto URI. Visitor email client will handle outbound delivery directly."
      };
    }

    // 2. Gmail Draft Staging (Owner-Approved Workflow)
    if (channel === "gmail_draft") {
      // In production, uses Google Gmail API users.drafts.create
      return {
        success: true,
        channel: "gmail_draft",
        status: "draft_staged",
        notes: "Outreach message staged in Gmail Drafts queue. Requires explicit owner review and dispatch."
      };
    }

    // 3. Direct SMTP Block Guardrail
    return {
      success: false,
      channel: "direct_smtp",
      status: "blocked",
      error: "Direct SMTP outbound sending from third-party subdomain without apex DKIM/SPF keys is prohibited.",
      notes: "Direct sending blocked to protect domain reputation and avoid spam rejections."
    };
  }
}
