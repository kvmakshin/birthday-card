// netlify/functions/instagram-oembed.js

export async function handler(event) {
  try {
    const { shortcode } = event.queryStringParameters || {};
    if (!shortcode) {
      return { statusCode: 400, body: 'shortcode required' };
    }

    // берём из ENV (Netlify подставляет автоматически)
    const appId     = process.env.IG_APP_ID;
    const appSecret = process.env.IG_APP_SECRET;
    const token     = `${appId}|${appSecret}`;

    // Graph API oEmbed endpoint
    const oembedUrl = `https://graph.facebook.com/v14.0/instagram_oembed` +
      `?url=${encodeURIComponent(`https://www.instagram.com/reel/${shortcode}/`)}` +
      `&access_token=${token}`;

    const res = await fetch(oembedUrl);
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: `Instagram Graph oEmbed error: ${res.statusText}`
      };
    }

    const json = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: json.html })
    };

  } catch (err) {
    console.error('🔥 instagram-oembed error:', err);
    return {
      statusCode: 500,
      body: `Function error: ${err.message}`
    };
  }
}
