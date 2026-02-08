// /api/vapi-webhook.js
// Receives Vapi webhook events (end-of-call-report) and emails lead summaries
// Vapi sends ALL server events to this URL — we filter for end-of-call-report only

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true }); // Vapi may send OPTIONS/GET
  }

  try {
    const body = req.body;
    const messageType = body?.message?.type;

    // ── Only process end-of-call-report events ──
    // Vapi sends many event types (status-update, transcript, etc.)
    // We only care about the final report after a call ends
    if (messageType !== 'end-of-call-report') {
      return res.status(200).json({ ok: true, ignored: messageType });
    }

    console.log('[vapi-webhook] Received end-of-call-report');

    // ── Extract data from Vapi payload ──
    const message = body.message;
    const call = message.call || {};
    const analysis = message.analysis || {};
    const artifact = message.artifact || {};

    // Structured lead data (auto-extracted by Vapi's analysisPlan)
    const lead = analysis.structuredData || {};
    const summary = analysis.summary || 'No summary available';
    const successEval = analysis.successEvaluation || 'N/A';

    // Call metadata
    const callId = call.id || 'unknown';
    const callType = call.type || 'unknown'; // inboundPhoneCall, outboundPhoneCall, webCall
    const callerNumber = call.customer?.number || call.from?.phoneNumber || 'unknown';
    const callDuration = message.durationSeconds || call.duration || 'unknown';
    const recordingUrl = message.recordingUrl || artifact.recordingUrl || call.recordingUrl || 'N/A';
    const endedReason = message.endedReason || call.endedReason || 'unknown';
    const timestamp = new Date(message.timestamp || Date.now()).toLocaleString('en-US', {
      timeZone: 'America/Denver', // Mountain Time for Montana
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // Build transcript from artifact messages (skip system messages)
    const transcript = (artifact.messages || [])
      .filter(m => m.role !== 'system')
      .map(m => {
        const speaker = m.role === 'assistant' ? '🤖 AI' : '👤 Caller';
        return `${speaker}: ${m.message || m.content || ''}`;
      })
      .join('\n');

    // ── Format the email ──
    const interestEmoji = {
      hot: '🔥 HOT',
      warm: '🟡 WARM',
      cold: '🔵 COLD'
    };

    const callTypeLabel = {
      inboundPhoneCall: '📞 Inbound Call',
      outboundPhoneCall: '📱 Outbound Demo',
      webCall: '🌐 Browser Voice Demo'
    };

    // Subject line — lead name or caller number, plus interest level
    const leadName = lead.lead_name || 'Unknown Caller';
    const interest = interestEmoji[lead.interest_level] || '⚪ Unknown';
    const subject = `${interest} Lead: ${leadName}${lead.business_name ? ` (${lead.business_name})` : ''} — AI Missoula`;

    // HTML email body — clean, scannable layout
    const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px;">
      
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #22d3ee; margin: 0; font-size: 20px;">🤖 AI Missoula — New Lead</h1>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">${timestamp} · ${callTypeLabel[callType] || callType}</p>
      </div>

      <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h2 style="color: #22d3ee; margin: 0 0 12px 0; font-size: 16px;">📋 Lead Summary</h2>
        <p style="margin: 0; line-height: 1.5; color: #cbd5e1;">${summary}</p>
      </div>

      <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h2 style="color: #22d3ee; margin: 0 0 12px 0; font-size: 16px;">👤 Lead Details</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap;">Name:</td><td style="color: #f1f5f9; padding: 4px 0;"><strong>${lead.lead_name || '—'}</strong></td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap;">Business:</td><td style="color: #f1f5f9; padding: 4px 0;">${lead.business_name || '—'}${lead.business_type ? ` (${lead.business_type})` : ''}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap;">Phone:</td><td style="color: #f1f5f9; padding: 4px 0;"><a href="tel:${lead.phone || callerNumber}" style="color: #22d3ee;">${lead.phone || callerNumber}</a></td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap;">Email:</td><td style="color: #f1f5f9; padding: 4px 0;">${lead.email ? `<a href="mailto:${lead.email}" style="color: #22d3ee;">${lead.email}</a>` : '—'}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap;">Location:</td><td style="color: #f1f5f9; padding: 4px 0;">${lead.location || '—'}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap;">Employees:</td><td style="color: #f1f5f9; padding: 4px 0;">${lead.employee_count || '—'}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap;">Interest:</td><td style="color: #f1f5f9; padding: 4px 0;">${interest}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap;">Free Trial:</td><td style="color: #f1f5f9; padding: 4px 0;">${lead.wants_free_trial ? '✅ YES' : lead.wants_free_trial === false ? '❌ No' : '—'}</td></tr>
        </table>
      </div>

      <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h2 style="color: #22d3ee; margin: 0 0 12px 0; font-size: 16px;">💡 Insights</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap; vertical-align: top;">Pain Points:</td><td style="color: #f1f5f9; padding: 4px 0;">${lead.pain_points || '—'}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap; vertical-align: top;">Interested In:</td><td style="color: #f1f5f9; padding: 4px 0;">${lead.interested_in || '—'}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0; white-space: nowrap; vertical-align: top;">Next Steps:</td><td style="color: #f1f5f9; padding: 4px 0;">${lead.next_steps || '—'}</td></tr>
        </table>
      </div>

      <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h2 style="color: #22d3ee; margin: 0 0 12px 0; font-size: 16px;">📝 Call Details</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0;">Duration:</td><td style="color: #f1f5f9; padding: 4px 0;">${typeof callDuration === 'number' ? `${Math.round(callDuration / 60)}m ${callDuration % 60}s` : callDuration}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0;">Ended:</td><td style="color: #f1f5f9; padding: 4px 0;">${endedReason}</td></tr>
          <tr><td style="color: #94a3b8; padding: 4px 8px 4px 0;">Success:</td><td style="color: #f1f5f9; padding: 4px 0;">${successEval}</td></tr>
          ${recordingUrl !== 'N/A' ? `<tr><td style="color: #94a3b8; padding: 4px 8px 4px 0;">Recording:</td><td style="padding: 4px 0;"><a href="${recordingUrl}" style="color: #22d3ee;">Listen →</a></td></tr>` : ''}
        </table>
      </div>

      <details style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <summary style="color: #22d3ee; cursor: pointer; font-size: 16px; font-weight: 600;">💬 Full Transcript</summary>
        <pre style="margin: 12px 0 0 0; white-space: pre-wrap; word-wrap: break-word; font-size: 13px; line-height: 1.6; color: #cbd5e1; max-height: 400px; overflow-y: auto;">${transcript || 'No transcript available'}</pre>
      </details>

      <div style="text-align: center; padding: 12px 0 0 0; border-top: 1px solid #334155;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">
          Call ID: ${callId}<br/>
          <a href="https://dashboard.vapi.ai" style="color: #22d3ee;">Open Vapi Dashboard →</a>
        </p>
      </div>
    </div>
    `;

    // ── Send email via Resend ──
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'hello@aimissoula.com';

    if (!RESEND_API_KEY) {
      // If no Resend key, log the lead data and return success
      // (Vapi still stores everything in its dashboard)
      console.log('[vapi-webhook] No RESEND_API_KEY — logging lead data:');
      console.log(JSON.stringify({ lead, summary, callId, callerNumber, callType, interest: lead.interest_level }, null, 2));
      return res.status(200).json({ 
        ok: true, 
        note: 'No RESEND_API_KEY configured — lead logged to console. Set up Resend to enable email notifications.',
        lead 
      });
    }

    // Send the email via Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // During testing, Resend lets you send from onboarding@resend.dev
        // Once you verify your domain, switch to hello@aimissoula.com
        from: process.env.RESEND_FROM_EMAIL || 'AI Missoula Leads <onboarding@resend.dev>',
        to: NOTIFICATION_EMAIL,
        subject: subject,
        html: emailHtml
      })
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('[vapi-webhook] Resend error:', emailResult);
      // Still return 200 to Vapi — we don't want retries flooding
      return res.status(200).json({ ok: true, emailError: emailResult });
    }

    console.log(`[vapi-webhook] ✅ Lead email sent for ${leadName} (${lead.interest_level || 'unknown'} interest)`);

    return res.status(200).json({ 
      ok: true, 
      emailSent: true,
      emailId: emailResult.id,
      lead: {
        name: lead.lead_name,
        interest: lead.interest_level,
        business: lead.business_name
      }
    });

  } catch (error) {
    console.error('[vapi-webhook] Error processing webhook:', error);
    // Always return 200 to Vapi to prevent retry storms
    return res.status(200).json({ ok: true, error: error.message });
  }
}
