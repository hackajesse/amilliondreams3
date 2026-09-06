/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Validates:
 *   1. Honeypot field (bot check)
 *   2. Required fields (name, email, message)
 *   3. Cloudflare Turnstile token
 *
 * Sends email via Cloudflare Email Workers send_email binding.
 *
 * Environment:
 *   EMAIL            — send_email binding (configured in wrangler.toml / Pages dashboard)
 *   CONTACT_TO       — encrypted secret: destination inbox
 *   TURNSTILE_SECRET_KEY — encrypted secret: Turnstile secret key
 *   CONTACT_FROM     — optional var: sending address, defaults to noreply@amilliondreams.llc
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
    return json({ ok: false, message: 'Invalid content type.' }, 415);
  }

  let data;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, message: 'Could not parse form data.' }, 400);
  }

  // 1. Honeypot
  if (data.get('website')) {
    // Silently succeed so bots think it worked
    return json({ ok: true }, 200);
  }

  // 2. Required fields
  const name    = trim(data.get('name'));
  const email   = trim(data.get('email'));
  const message = trim(data.get('message'));
  const company = trim(data.get('company'));
  const need    = trim(data.get('need'));

  if (!name || !email || !message) {
    return json({ ok: false, message: 'Name, email, and message are required.' }, 422);
  }
  if (!isValidEmail(email)) {
    return json({ ok: false, message: 'Please provide a valid email address.' }, 422);
  }

  // 3. Turnstile verification
  const turnstileToken = trim(data.get('cf-turnstile-response'));
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;

  if (turnstileSecret) {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken ?? '',
        remoteip: request.headers.get('CF-Connecting-IP') ?? '',
      }),
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      return json({ ok: false, message: 'Bot check failed. Please try again.' }, 403);
    }
  }

  // 4. Send email
  const to      = env.CONTACT_TO;
  const from    = env.CONTACT_FROM ?? 'noreply@amilliondreams.llc';
  const emailBinding = env.EMAIL;

  if (!emailBinding || !to) {
    // Email not yet configured — log and return graceful error in non-prod
    console.error('Email binding or CONTACT_TO not configured.');
    return json({ ok: false, message: 'Contact form not fully configured yet. Please reach out on LinkedIn.' }, 503);
  }

  const subject = `[AMD] New inquiry from ${name}${company ? ` (${company})` : ''}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    need ? `Service area: ${need}` : null,
    '',
    message,
    '',
    '---',
    'Sent via amilliondreams.llc contact form',
  ].filter(Boolean).join('\n');

  const html = `
    <div style="font-family: sans-serif; max-width: 600px;">
      <h2 style="color:#c9a84c;">New inquiry — A Million Dreams</h2>
      <table>
        <tr><th align="left">Name</th><td>${esc(name)}</td></tr>
        <tr><th align="left">Email</th><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        ${company ? `<tr><th align="left">Company</th><td>${esc(company)}</td></tr>` : ''}
        ${need ? `<tr><th align="left">Service area</th><td>${esc(need)}</td></tr>` : ''}
      </table>
      <hr style="border:none;border-top:1px solid #c9a84c33;margin:16px 0"/>
      <p style="white-space:pre-wrap;color:#333">${esc(message)}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
      <p style="color:#999;font-size:12px">Sent via amilliondreams.llc</p>
    </div>
  `;

  try {
    await emailBinding.send({
      to,
      from,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error('Email send error:', err);
    return json({ ok: false, message: 'Failed to send message. Please try again or reach out on LinkedIn.' }, 500);
  }

  return json({ ok: true }, 200);
}

// ---- helpers ----

function trim(v) {
  return typeof v === 'string' ? v.trim() : (v ?? '').toString().trim();
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
