// /api/adcopy.js
// Generates ad copy via OpenAI — keeps the API key server-side on Vercel
// Called by the AI Ad Copy Generator demo on the website

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessName, businessType } = req.body;

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        temperature: 0.8,  // Slightly more creative for ad copy
        messages: [
          {
            role: 'system',
            content: `You are an expert social media copywriter for AI Missoula, an AI automation agency. Generate a single compelling Facebook/Instagram ad for the user's business. Include:
- A scroll-stopping headline (with emoji)
- 3-4 lines of punchy body copy
- A clear call to action

Make it specific to their business type and location (Montana/Missoula area). Keep the total output under 100 words. Output ONLY the ad copy, no explanations or options.`,
          },
          {
            role: 'user',
            content: `Business name: ${businessName || 'my business'}\nBusiness type: ${businessType || 'small business'}\nLocation: Missoula, Montana area`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[adcopy] OpenAI error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'OpenAI error' });
    }

    const copy = data.choices?.[0]?.message?.content || "Couldn't generate — but our team will send you custom copy!";
    return res.status(200).json({ copy });

  } catch (error) {
    console.error('[adcopy] Error:', error);
    return res.status(500).json({ error: 'Failed to generate ad copy' });
  }
}
