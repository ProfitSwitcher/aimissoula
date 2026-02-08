// /api/chat.js
// Proxies chat messages to OpenAI API — keeps the API key server-side on Vercel
// Called by the AI Chat Consultant demo on the website

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  try {
    // OpenAI format: system message goes as first message in the array
    const openaiMessages = [];
    if (system) {
      openaiMessages.push({ role: 'system', content: system });
    }
    openaiMessages.push(...messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',    // Fast, cheap, great for chat demos
        max_tokens: 1000,
        temperature: 0.7,
        messages: openaiMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[chat] OpenAI error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'OpenAI error' });
    }

    // Return in a simplified format the frontend can use
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I hit a snag. Try again?';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('[chat] Error:', error);
    return res.status(500).json({ error: 'Failed to get response' });
  }
}
