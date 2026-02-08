/**
 * /api/call — Outbound demo call via Vapi
 *
 * Uses the saved AI Missoula assistant (VAPI_ASSISTANT_ID) with
 * outbound-specific overrides so the greeting references the website demo.
 * Same phone number used for both inbound reception and outbound demo calls.
 *
 * Required env vars:
 *   VAPI_API_KEY          — Private key from dashboard.vapi.ai
 *   VAPI_PHONE_NUMBER_ID  — ID of the Vapi phone number
 *   VAPI_ASSISTANT_ID     — Saved assistant ID
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, name, business } = req.body || {};

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Clean phone to E.164
  const cleaned = phone.replace(/\D/g, "");
  const e164 = cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`;

  const apiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID || "2f0c28c6-3dbe-487d-a0b6-4496d591c6c0";
  const assistantId = process.env.VAPI_ASSISTANT_ID || "0e689b73-feb2-490a-be42-205b0562a451";

  if (!apiKey) {
    console.error("Missing VAPI_API_KEY env var");
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId,
        assistantOverrides: {
          firstMessage: name
            ? `Hey ${name}! This is the AI assistant from AI Missoula — you just hit the demo button on our website. Pretty wild that I'm calling you right now, huh? So tell me, what kind of business ${business ? `is ${business}` : "are you running"}?`
            : `Hey there! This is the AI assistant from AI Missoula — you just hit the demo button on our website. Pretty cool that a real AI is calling you, right? So tell me, what kind of business are you running?`,
          metadata: {
            source: "website-demo",
            leadName: name || "Unknown",
            leadPhone: e164,
            leadBusiness: business || "Not provided",
            callType: "outbound-demo",
          },
        },
        phoneNumberId,
        customer: {
          number: e164,
          name: name || undefined,
        },
      }),
    });

    const data = await response.json();

    if (response.status === 201 || response.ok) {
      return res.status(200).json({ success: true, callId: data.id });
    } else {
      console.error("Vapi API error:", data);
      return res.status(response.status).json({ success: false, error: data });
    }
  } catch (err) {
    console.error("Call failed:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
