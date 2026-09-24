// lib/submit-form.ts
// Shared client-side helper for every form that goes through the reply
// portal (/api/contact). Keeps the four call sites (contact, order-now, the
// order modal, and the enquiry drawer) on one contract instead of four
// slightly different fetch calls.

export interface FormField {
  label: string;
  value: string;
}

export type ReplyPortalFormType = 'contact' | 'order' | 'enquiry';

export interface SubmitFormArgs {
  formType: ReplyPortalFormType;
  name: string;
  email: string;
  fields: FormField[];
  /** Honeypot value — leave bound to a hidden input real users never fill in. */
  website?: string;
}

export interface SubmitFormResult {
  success: boolean;
  message?: string;
}

export async function submitToReplyPortal(args: SubmitFormArgs): Promise<SubmitFormResult> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    let data: SubmitFormResult;
    try {
      data = await res.json();
    } catch {
      data = { success: false };
    }

    if (res.ok && data.success) {
      return { success: true };
    }
    return {
      success: false,
      message: data.message || 'Could not send your enquiry. Please contact us via WhatsApp or phone instead.',
    };
  } catch {
    return {
      success: false,
      message: 'Could not reach the server. Please check your connection or contact us via WhatsApp.',
    };
  }
}
