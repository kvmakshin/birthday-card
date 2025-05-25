import fetch from 'node-fetch';

export async function handler(event) {
  const { shortcode } = event.queryStringParameters || {};
  if (!shortcode) {
    return { statusCode: 400, body: 'shortcode required' };
  }

  // публичный oEmbed endpoint (не требует токена)
  const oembedUrl = `https://api.instagram.com/oembed/?url=` +
                    encodeURIComponent(`https://www.instagram.com/reel/${shortcode}/`);

  const res = await fetch(oembedUrl);
  if (!res.ok) {
    return { statusCode: res.status, body: res.statusText };
  }

  const json = await res.json();
  // json.html содержит <blockquote>…</blockquote>
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: json.html })
  };
}
