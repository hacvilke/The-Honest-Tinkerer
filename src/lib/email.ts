import nodemailer from "nodemailer";
import type { NewsletterIssue } from "@/lib/types";

/**
 * Newsletter email delivery — Option B, the boring reliable way.
 *
 * Renders the Friday Log Dump issue as styled HTML + plain text and sends it
 * to every subscriber via SMTP (Gmail App Password). Credentials live in
 * process.env (never in source). If the SMTP env vars aren't set, `sendBroadcast`
 * resolves to a no-op with `delivered: false` so the broadcast loop still works
 * in dev/preview without a mail server.
 *
 * Server-only. No "use client".
 */

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for 587/STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

/** Whether real SMTP delivery is configured. */
export function isSmtpConfigured(): boolean {
  return getTransporter() !== null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A labelled field block in the email HTML. */
function field(label: string, body: string): string {
  return `
    <tr>
      <td style="padding:0 0 16px 0;">
        <p style="margin:0 0 4px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#b45309;">${escapeHtml(label)}</p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#1c1917;">${escapeHtml(body)}</p>
      </td>
    </tr>`;
}

/**
 * Render the Friday Log Dump as a self-contained HTML email.
 * Inline styles only (email clients ignore <style> in many cases).
 * Neutral palette + amber accents to match the site aesthetic.
 */
export function renderIssueHtml(issue: NewsletterIssue): string {
  const repoLine = issue.links.repo
    ? `<a href="${escapeHtml(issue.links.repo)}" style="color:#b45309;">Check out the live build (dead-end repo)</a>`
    : `<span style="color:#78716c;">No public repo — it was a dead end, that's the point.</span>`;
  const siteLine = `<a href="${escapeHtml(issue.links.site)}" style="color:#b45309;">Read the full post on the site</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(issue.subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;">
        <!-- header -->
        <tr>
          <td style="background:#fafaf9;border-bottom:1px solid #e7e5e4;padding:20px 28px;">
            <p style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b45309;">The Honest Tinkerer</p>
            <p style="margin:4px 0 0 0;font-size:18px;font-weight:600;color:#1c1917;">${escapeHtml(issue.subject)}</p>
            <p style="margin:6px 0 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#78716c;">Issue #${String(issue.issue).padStart(2, "0")} · To ${issue.subscriberCount} ${issue.subscriberCount === 1 ? "subscriber" : "subscribers"}</p>
          </td>
        </tr>
        <!-- body -->
        <tr><td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${field("The TL;DR", issue.tldr)}
            <tr><td style="padding:0 0 8px 0;"><p style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#78716c;">What I Built</p></td></tr>
            ${field("The Goal", issue.goal)}
            ${field("The Stack", issue.stack)}
            ${field("Status", issue.status)}
            ${field("The Part That Broke (The Reality Check)", issue.broke)}
            ${field("The Boring Workaround", issue.workaround)}
            <tr><td style="padding:0 0 8px 0;border-top:1px solid #f0efee;"><p style="margin:12px 0 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#78716c;">Tinkerer Links</p></td></tr>
            <tr><td style="padding:0 0 4px 0;"><p style="margin:0;font-size:14px;line-height:1.6;color:#1c1917;">${siteLine}</p></td></tr>
            <tr><td style="padding:0 0 16px 0;"><p style="margin:0;font-size:14px;line-height:1.6;color:#1c1917;">${repoLine}</p></td></tr>
          </table>
          <p style="margin:16px 0 0 0;border-top:1px solid #f0efee;padding-top:14px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#a8a29e;">The Honest Tinkerer · written while still annoyed · unsubscribe by ignoring me, like a normal person</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Plain-text fallback for the same issue. */
export function renderIssueText(issue: NewsletterIssue): string {
  const repoLine = issue.links.repo
    ? `Check out the live build: ${issue.links.repo}`
    : "No public repo — it was a dead end, that's the point.";
  return [
    `The Honest Tinkerer — ${issue.subject}`,
    `Issue #${String(issue.issue).padStart(2, "0")} · To ${issue.subscriberCount} ${issue.subscriberCount === 1 ? "subscriber" : "subscribers"}`,
    "",
    "THE TL;DR",
    issue.tldr,
    "",
    "WHAT I BUILT",
    `The Goal: ${issue.goal}`,
    `The Stack: ${issue.stack}`,
    `Status: ${issue.status}`,
    "",
    "THE PART THAT BROKE (THE REALITY CHECK)",
    issue.broke,
    "",
    "THE BORING WORKAROUND",
    issue.workaround,
    "",
    "TINKERER LINKS",
    `- Read the full post on the site: ${issue.links.site}`,
    `- ${repoLine}`,
    "",
    "The Honest Tinkerer · written while still annoyed · unsubscribe by ignoring me, like a normal person",
  ].join("\n");
}

export interface SendResult {
  delivered: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send the rendered issue to every recipient via SMTP (BCC, single message).
 * Returns { delivered: false } when SMTP isn't configured (dev fallback).
 */
export async function sendBroadcast(
  issue: NewsletterIssue,
  recipients: string[]
): Promise<SendResult> {
  const t = getTransporter();
  if (!t) {
    return { delivered: false, error: "SMTP not configured" };
  }
  if (recipients.length === 0) {
    return { delivered: false, error: "No recipients" };
  }

  const from = process.env.SMTP_USER!;
  try {
    const info = await t.sendMail({
      from: `"The Honest Tinkerer" <${from}>`,
      to: from, // sender as the visible "To"; recipients go BCC
      bcc: recipients,
      subject: issue.subject,
      text: renderIssueText(issue),
      html: renderIssueHtml(issue),
    });
    return { delivered: true, messageId: info.messageId };
  } catch (err) {
    return {
      delivered: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Double opt-in: verification email
// ---------------------------------------------------------------------------

/**
 * Render the verification email as HTML. One big call-to-action button.
 */
export function renderVerificationHtml(
  email: string,
  verifyUrl: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verify your inbox</title></head>
<body style="margin:0;padding:0;background:#f5f5f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#fafaf9;border-bottom:1px solid #e7e5e4;padding:20px 28px;">
            <p style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b45309;">The Honest Tinkerer</p>
            <p style="margin:4px 0 0 0;font-size:18px;font-weight:600;color:#1c1917;">Verify your inbox</p>
          </td>
        </tr>
        <tr><td style="padding:24px 28px;">
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#1c1917;">Someone (probably you) added <strong>${escapeHtml(email)}</strong> to The Friday Log Dump. No Friday logs until you confirm it's actually your inbox — this keeps bots and typos off the list.</p>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#1c1917;">Click the button to verify. You'll get one email a week, written while still annoyed.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${escapeHtml(verifyUrl)}" style="display:inline-block;background:#1c1917;color:#fafaf9;font-size:15px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">Verify my inbox</a>
            </td></tr>
          </table>
          <p style="margin:20px 0 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.6;color:#a8a29e;">If the button doesn't work, paste this into your browser:<br/>${escapeHtml(verifyUrl)}</p>
          <p style="margin:16px 0 0 0;border-top:1px solid #f0efee;padding-top:14px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#a8a29e;">Didn't subscribe? Ignore this email — nothing happens until you click.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function renderVerificationText(
  email: string,
  verifyUrl: string
): string {
  return [
    "The Honest Tinkerer — Verify your inbox",
    "",
    `Someone added ${email} to The Friday Log Dump.`,
    "No Friday logs until you confirm it's actually your inbox.",
    "",
    "Verify by opening this link in your browser:",
    verifyUrl,
    "",
    "Didn't subscribe? Ignore this email — nothing happens until you click.",
  ].join("\n");
}

/**
 * Send the double-opt-in verification email to a single address.
 * Returns { delivered, messageId, error }.
 */
export async function sendVerification(
  email: string,
  token: string,
  origin: string
): Promise<SendResult> {
  const t = getTransporter();
  if (!t) {
    return { delivered: false, error: "SMTP not configured" };
  }
  const verifyUrl = `${origin}/api/verify?token=${encodeURIComponent(token)}`;
  const from = process.env.SMTP_USER!;
  try {
    const info = await t.sendMail({
      from: `"The Honest Tinkerer" <${from}>`,
      to: email,
      subject: "Verify your inbox — The Friday Log Dump",
      text: renderVerificationText(email, verifyUrl),
      html: renderVerificationHtml(email, verifyUrl),
    });
    return { delivered: true, messageId: info.messageId };
  } catch (err) {
    return {
      delivered: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
