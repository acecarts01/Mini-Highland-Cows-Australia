// lib/mailer.ts
// Zoho SMTP transport for the site's reply portal (contact, order, and
// enquiry forms). Credentials come from environment variables only — never
// hardcode them, and never pass them through the client.

import nodemailer, { type Transporter } from 'nodemailer';

interface ZohoEnv {
  host: string;
  port: number;
  user: string;
  pass: string;
}

/**
 * Reads and validates the SMTP environment. Returns null (rather than
 * throwing) when unconfigured, so callers can degrade to a clear "not set
 * up yet" response instead of a crash — this matters in local dev and in
 * preview deployments where the app password hasn't been added yet.
 */
function readEnv(): ZohoEnv | null {
  const host = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';
  const port = Number(process.env.ZOHO_SMTP_PORT || 465);
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;

  if (!user || !pass) return null;
  return { host, port, user, pass };
}

let cached: Transporter | null = null;
let cachedKey = '';

export function getTransporter(): Transporter | null {
  const env = readEnv();
  if (!env) return null;

  const key = `${env.host}:${env.port}:${env.user}`;
  if (cached && cachedKey === key) return cached;

  cached = nodemailer.createTransport({
    host: env.host,
    port: env.port,
    secure: env.port === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: env.user, pass: env.pass },
  });
  cachedKey = key;
  return cached;
}

export function isMailerConfigured(): boolean {
  return readEnv() !== null;
}

export function senderAddress(): string {
  return process.env.ZOHO_SMTP_USER || 'info@minihighlandcow.com.au';
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  bcc?: string;
}

/** Throws on failure — callers decide how to report that to the client. */
export async function sendMail({ to, subject, html, text, replyTo, bcc }: SendArgs): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error('Mailer not configured: ZOHO_SMTP_USER / ZOHO_SMTP_PASS are not set.');
  }

  await transporter.sendMail({
    from: `"Mini Highland Cows" <${senderAddress()}>`,
    to,
    bcc,
    replyTo,
    subject,
    html,
    text,
  });
}
