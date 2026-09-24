// lib/email-templates.ts
// HTML email builders for the reply portal.
//
// Every <table>/<td> below carries BOTH the bgcolor attribute and a
// background-color CSS property, never just one. Outlook and Apple Mail
// default an unstyled nested table to opaque white regardless of the
// parent's background — that mismatch is invisible in a browser preview or
// an emulator and only shows up in a real inbox on a real phone. See
// docs/reply-portal.md.

export interface FormField {
  label: string;
  value: string;
}

const BRAND = {
  charcoal: '#232320',
  parchment: '#fbf9f5',
  gold: '#b08d57',
  forest: '#1c3028',
  white: '#ffffff',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fieldRows(fields: FormField[]): string {
  return fields
    .filter((f) => f.value && f.value.trim().length > 0)
    .map(
      (f) => `
      <tr>
        <td bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment}; padding:10px 14px; border-bottom:1px solid #e5dec9; font-family:Arial,Helvetica,sans-serif; font-size:12px; font-weight:bold; color:#705d48; width:38%; vertical-align:top;">
          ${escapeHtml(f.label)}
        </td>
        <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:10px 14px; border-bottom:1px solid #e5dec9; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${BRAND.charcoal};">
          ${escapeHtml(f.value)}
        </td>
      </tr>`
    )
    .join('');
}

function shell(opts: { preheader: string; title: string; intro: string; fields: FormField[]; footer: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(opts.title)}</title>
</head>
<body bgcolor="${BRAND.parchment}" style="margin:0; padding:0; background-color:${BRAND.parchment};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; max-width:600px; width:100%; border-radius:12px; overflow:hidden; border:1px solid #e5dec9;">
          <tr>
            <td bgcolor="${BRAND.forest}" style="background-color:${BRAND.forest}; padding:20px 24px;">
              <span style="font-family:Georgia,'Times New Roman',serif; font-size:20px; font-weight:bold; color:#e5c07b;">Mini Highland Cows</span>
              <br />
              <span style="font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#c9d6cf; letter-spacing:0.04em;">MHC PTY LTD &bull; Roma, QLD</span>
            </td>
          </tr>
          <tr>
            <td bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; padding:24px;">
              <h1 style="margin:0 0 12px; font-family:Georgia,'Times New Roman',serif; font-size:19px; color:${BRAND.charcoal};">${escapeHtml(opts.title)}</h1>
              <p style="margin:0 0 18px; font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:1.6; color:#4b4337;">${opts.intro}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.white}" style="background-color:${BRAND.white}; border:1px solid #e5dec9; border-radius:8px; overflow:hidden;">
                ${fieldRows(opts.fields)}
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="${BRAND.parchment}" style="background-color:${BRAND.parchment}; padding:16px 24px; font-family:Arial,Helvetica,sans-serif; font-size:11px; line-height:1.6; color:#8a8271; border-top:1px solid #e5dec9;">
              ${opts.footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function plainText(title: string, intro: string, fields: FormField[], footer: string): string {
  const lines = fields
    .filter((f) => f.value && f.value.trim().length > 0)
    .map((f) => `${f.label}: ${f.value}`);
  return [title, '', intro, '', ...lines, '', footer].join('\n');
}

/** Sent to the business inbox for every submission. */
export function businessNotificationEmail(args: {
  formLabel: string;
  fields: FormField[];
  submittedAt: string;
}) {
  const title = `New ${args.formLabel}`;
  const intro = `A new ${args.formLabel.toLowerCase()} came in through the website on ${escapeHtml(
    args.submittedAt
  )}. Reply directly to this email to respond — it is already addressed to the sender.`;
  const footer = 'Sent automatically by the Mini Highland Cows website reply portal.';

  return {
    subject: `[Website] ${args.formLabel}`,
    html: shell({ preheader: intro, title, intro, fields: args.fields, footer }),
    text: plainText(title, intro, args.fields, footer),
  };
}

/** Sent to the customer confirming their submission was received. */
export function customerConfirmationEmail(args: {
  name: string;
  formLabel: string;
  fields: FormField[];
}) {
  const title = `We've received your ${args.formLabel.toLowerCase()}`;
  const intro = `Thanks${
    args.name ? `, ${escapeHtml(args.name)}` : ''
  }. Our Roma stud desk has your details below and will be in touch shortly. For anything urgent, WhatsApp or call us directly — details in the footer.`;
  const footer =
    'Mini Highland Cows &bull; MHC PTY LTD &bull; Roma, QLD, Australia &bull; This is an automated confirmation — replies to this address are monitored.';

  return {
    subject: `We've received your ${args.formLabel.toLowerCase()} — Mini Highland Cows`,
    html: shell({ preheader: intro, title, intro, fields: args.fields, footer }),
    text: plainText(title, intro, args.fields, footer),
  };
}
