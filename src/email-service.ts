/**
 * WHEN - Email Service (Resend)
 * Resend API를 사용한 이메일 발송
 */

interface ResendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface ResendResponse {
  id: string;
}

/**
 * Resend API를 통해 이메일 발송
 */
export async function sendEmail(
  options: ResendEmailOptions,
  apiKey: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: options.from || 'WHEN <readings@when.app>',
        to: [options.to],
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `Resend API error: ${response.status} - ${JSON.stringify(errorData)}`,
      };
    }

    const data = await response.json() as ResendResponse;
    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: `Email send failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * FREE 리딩 이메일 발송
 */
export async function sendFreeReadingEmail(
  to: string,
  userName: string,
  readingHtml: string,
  apiKey: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendEmail(
    {
      to,
      subject: `${userName}, your timing preview is ready ✨`,
      html: readingHtml,
    },
    apiKey
  );
}

/**
 * FULL 리딩 이메일 발송
 */
export async function sendFullReadingEmail(
  to: string,
  userName: string,
  readingHtml: string,
  apiKey: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendEmail(
    {
      to,
      subject: `${userName}, your complete timing map is ready 🗺️`,
      html: readingHtml,
    },
    apiKey
  );
}

/**
 * 결제 확인 이메일 발송
 */
export async function sendPaymentConfirmationEmail(
  to: string,
  userName: string,
  readingUrl: string,
  apiKey: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      color: #2d2d2d;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #faf9f7;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .success-badge {
      display: inline-block;
      background: #4a5d4a;
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      margin: 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: #4a5d4a;
      color: white;
      padding: 16px 36px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">WHEN</div>
    <div class="success-badge">✓ Payment Confirmed</div>
  </div>
  
  <h2>Thank you, ${userName}!</h2>
  
  <p>Your complete timing map is now unlocked and ready to explore.</p>
  
  <p style="text-align: center;">
    <a href="${readingUrl}" class="cta-button">View My Full Reading →</a>
  </p>
  
  <p>This reading includes detailed insights across 8 life categories:</p>
  <ul>
    <li>Career & Professional Life</li>
    <li>Love & Relationships</li>
    <li>Wealth & Finances</li>
    <li>Health & Vitality</li>
    <li>Family & Close Relationships</li>
    <li>Personal Growth & Learning</li>
    <li>Life Purpose & Direction</li>
    <li>${new Date().getFullYear()} Forecast</li>
  </ul>
  
  <p>Your reading is always accessible at the link above. Bookmark it for future reference.</p>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} WHEN. Not predictions. Perspective.</p>
    <p>Questions? Reply to this email.</p>
  </div>
</body>
</html>
`;

  return sendEmail(
    {
      to,
      subject: `✓ Payment confirmed - Your full timing map is ready`,
      html,
    },
    apiKey
  );
}
