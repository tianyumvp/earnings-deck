// pages/api/send-report.js
// 发送报告到用户邮箱，并自动创建轻量级账户

import { Resend } from 'resend';
import { getOrCreateUser, addReportToUser } from '../../lib/userStore';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  maxDuration: 10,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // 检查 RESEND_API_KEY
  if (!process.env.RESEND_API_KEY) {
    console.error('[Send Report] RESEND_API_KEY not configured');
    return res.status(500).json({ 
      ok: false, 
      error: 'Email service not configured. Please contact support.' 
    });
  }

  const { email, deckUrl, ticker } = req.body || {};

  if (!email || !deckUrl || !ticker) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Missing required fields: email, deckUrl, or ticker' 
    });
  }

  // 简单的邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Please enter a valid email address' 
    });
  }

  try {
    console.log('[Send Report] Sending to:', email, 'for ticker:', ticker);

    // 创建/获取用户并保存报告历史
    const user = getOrCreateUser(email);
    addReportToUser(email, {
      ticker,
      deckUrl,
      title: `${ticker} Earnings Report`,
    });
    console.log('[Send Report] User updated:', email, 'Reports:', user.reports.length);

    // 发送邮件
    const { data, error } = await resend.emails.send({
      from: 'BriefingDeck <reports@briefingdeck.com>',
      to: email,
      subject: `Your ${ticker} Earnings Report is Ready`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Report is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #faf9f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf9f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);">
              <div style="font-size: 24px; font-weight: 600; color: #faf9f6; margin-bottom: 8px;">
                📊 BriefingDeck
              </div>
              <div style="font-size: 14px; color: #a3a3a3;">
                AI-Powered Stock Analysis
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #1a1a1a;">
                Your ${ticker} Report is Ready
              </h1>
              
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #525252;">
                We've generated a comprehensive earnings analysis for <strong>${ticker}</strong>. 
                Click the button below to download your report.
              </p>
              
              <!-- Download Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${deckUrl}" 
                   style="display: inline-block; padding: 16px 32px; background-color: #1a1a1a; color: #faf9f6; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 500;">
                  📥 Download PDF Report
                </a>
              </div>
              
              <!-- Info Box -->
              <div style="background-color: #f5f5f0; border-radius: 12px; padding: 20px; margin: 32px 0;">
                <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px;">
                  What's Inside
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #525252; line-height: 1.8;">
                  <li>Company overview & business model</li>
                  <li>Latest financial performance</li>
                  <li>Key growth drivers & metrics</li>
                  <li>Investor takeaways & outlook</li>
                </ul>
              </div>
              
              <p style="margin: 32px 0 0; font-size: 14px; color: #737373; line-height: 1.6;">
                This report was generated by AI using the latest available financial data. 
                For informational purposes only — not investment advice.
              </p>
              
              <!-- Create Account CTA -->
              <div style="background: linear-gradient(135deg, #faf9f6 0%, #f0efe9 100%); border-radius: 12px; padding: 24px; margin: 32px 0; text-align: center;">
                <h4 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1a1a1a;">
                  💼 Save Your Reports
                </h4>
                <p style="margin: 0 0 16px; font-size: 14px; color: #525252;">
                  Create a free account to access all your reports anytime, anywhere.
                </p>
                <a href="https://briefingdeck.com?email=${encodeURIComponent(email)}&action=register" 
                   style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: #faf9f6; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
                  Create Free Account →
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; border-top: 1px solid #e5e5e0;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #525252;">
                Want to analyze another stock?
              </p>
              <a href="https://briefingdeck.com" 
                 style="display: inline-block; padding: 12px 24px; border: 1px solid #d4d4ce; color: #1a1a1a; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
                Generate Another Report →
              </a>
              
              <p style="margin: 32px 0 0; font-size: 12px; color: #a3a3a3;">
                © ${new Date().getFullYear()} BriefingDeck · 
                <a href="https://briefingdeck.com" style="color: #737373;">briefingdeck.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error('[Send Report] Resend error:', JSON.stringify(error));
      // 返回更详细的错误信息帮助诊断
      return res.status(500).json({ 
        ok: false, 
        error: error?.message || 'Failed to send email. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }

    console.log('[Send Report] Email sent successfully:', data?.id);

    return res.status(200).json({
      ok: true,
      message: 'Report sent to your email!',
      emailId: data?.id,
    });

  } catch (err) {
    console.error('[Send Report] Error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Failed to send email. Please try again.',
    });
  }
}
