// netlify/functions/instagram-oembed.js

export async function handler(event) {
  const { shortcode } = event.queryStringParameters || {};

  if (!shortcode) {
    return { statusCode: 400, body: 'shortcode required' };
  }

  // oEmbed endpoint Instagram (публичный, CORS разрешён)
  const oembedUrl = `https://api.instagram.com/oembed/` +
                    `?url=${encodeURIComponent(`https://www.instagram.com/reel/${shortcode}/`)}`;

  // здесь используем глобальный fetch — он есть в Node 18 на Netlify
  const res = await fetch(oembedUrl);
  if (!res.ok) {
    return { statusCode: res.status, body: res.statusText };
  }

  const json = await res.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: json.html })
  };
}