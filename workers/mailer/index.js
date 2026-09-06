/**
 * amd-mailer — Cloudflare Worker
 *
 * Accepts POST /send with a JSON body from the amilliondreams Pages Function.
 * Authenticates via a shared MAILER_SECRET header.
 * Sends email via the send_email (EMAIL) binding.
 *
 * Environment:
 *   EMAIL         — send_email binding (wrangler.toml)
 *   MAILER_SECRET — shared secret (wrangler secret put MAILER_SECRET)
 */

export default {
  async fetch(request, env) {
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/send') {
      return new Response('Not found', { status: 404 });
    }

    // Auth — constant-time comparison via WebCrypto
    const incomingSecret = request.headers.get('x-mailer-secret') ?? '';
    const expectedSecret = env.MAILER_SECRET ?? '';
    if (!expectedSecret || !await timingSafeEqual(incomingSecret, expectedSecret)) {
      return new Response('Forbidden', { status: 403 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    const { to, from, replyTo, subject, text, html } = payload;
    if (!to || !from || !subject || (!text && !html)) {
      return new Response('Missing required fields', { status: 422 });
    }

    try {
      await env.EMAIL.send({ to, from, replyTo, subject, text, html });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Email send error:', err);
      return new Response(JSON.stringify({ ok: false, error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

async function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const ka = await crypto.subtle.importKey('raw', enc.encode(a), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const kb = await crypto.subtle.importKey('raw', enc.encode(b), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const buf = enc.encode('compare');
  const [sa, sb] = await Promise.all([
    crypto.subtle.sign('HMAC', ka, buf),
    crypto.subtle.sign('HMAC', kb, buf),
  ]);
  if (sa.byteLength !== sb.byteLength) return false;
  const va = new Uint8Array(sa);
  const vb = new Uint8Array(sb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}
