/**
 * Gmail API helpers for amd-mailer (OAuth refresh token → messages.send).
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

export async function sendViaGmail(env, { to, from, replyTo, subject, text, html }) {
  const accessToken = await refreshAccessToken(env);
  const raw = buildRawMessage({ to, from, replyTo, subject, text, html });

  const res = await fetch(SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Gmail send ${res.status}: ${body}`);
  }
}

async function refreshAccessToken(env) {
  const clientId = env.GMAIL_CLIENT_ID;
  const clientSecret = env.GMAIL_CLIENT_SECRET;
  const refreshToken = env.GMAIL_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, or GMAIL_REFRESH_TOKEN');
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Gmail token ${res.status}: ${body}`);
  }

  const json = await res.json();
  if (!json.access_token) throw new Error('Gmail token response missing access_token');
  return json.access_token;
}

function buildRawMessage({ to, from, replyTo, subject, text, html }) {
  const headers = [
    `To: ${to}`,
    `From: ${from}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
  ].filter(Boolean);

  let body;
  if (html && text) {
    const boundary = `amd_${crypto.randomUUID().replace(/-/g, '')}`;
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    body = [
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      text,
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      '',
      html,
      `--${boundary}--`,
    ].join('\r\n');
  } else if (html) {
    headers.push('Content-Type: text/html; charset="UTF-8"');
    body = html;
  } else {
    headers.push('Content-Type: text/plain; charset="UTF-8"');
    body = text;
  }

  return toBase64Url(`${headers.join('\r\n')}\r\n\r\n${body}`);
}

function encodeSubject(subject) {
  // ASCII-only subjects pass through; otherwise RFC 2047 UTF-8
  if (/^[\x20-\x7E]*$/.test(subject)) return subject;
  const bytes = new TextEncoder().encode(subject);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return `=?UTF-8?B?${btoa(binary)}?=`;
}

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
