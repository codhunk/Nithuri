const { Resend } = require("resend");

// Ensure keys are loaded
if (!process.env.RESEND_API_KEY) {
  console.error("❌ CRITICAL: RESEND_API_KEY is missing in environment variables!");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Default to onboarding@resend.dev to ensure a valid sender during testing
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const APP_NAME = "Nithuri Singh & Sons";

/**
 * Send OTP verification email
 */
const sendOtpEmail = async ({ to, name, otp }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`, // Quoting prevents symbols like '&' from breaking headers
      to: [to],
      subject: `${otp} is your verification code — ${APP_NAME}`,
      html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f5f5f0;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(5,76,68,0.08);">
                  <tr>
                    <td style="background:#054c44;padding:36px 40px;text-align:center;color:#ffffff;">
                      <h1 style="margin:0;font-size:22px;font-weight:900;">Nithuri Singh &amp; Sons</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:48px 40px 32px;">
                      <h2 style="margin:0 0 20px;color:#0f172a;font-size:28px;font-weight:900;">Hello, ${name} 👋</h2>
                      <p style="margin:0 0 32px;color:#475569;font-size:16px;line-height:1.7;">
                        Use the code below to verify your email. Valid for 10 minutes.
                      </p>
                      <div style="background:#f0fdf4;border:2px solid #054c44;border-radius:16px;padding:28px;text-align:center;margin-bottom:32px;">
                        <p style="margin:0;color:#054c44;font-size:48px;font-weight:900;letter-spacing:12px;">${otp}</p>
                      </div>
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
      console.error("Resend API Error:", error);
      throw new Error(`Email send failed: ${error.message}`);
    }
    return data;
  } catch (err) {
    console.error("Resend SDK Fetch Error:", err);
    throw new Error(`Email send failed: ${err.message || 'Network error while reaching Resend.'}`);
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: [to],
      subject: `Reset your password — ${APP_NAME}`,
      html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Reset your password</h2>
          <p>Hi ${name}, click the link below to reset your password. Valid for 10 minutes.</p>
          <a href="${resetUrl}" style="background:#054c44;color:#white;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password</a>
        </body>
      </html>
      `,
    });

    if (error) throw new Error(`Email send failed: ${error.message}`);
    return data;
  } catch (err) {
    console.error("Resend Reset Fetch Error:", err);
    throw new Error(`Email send failed: ${err.message || 'Unable to reach email server.'}`);
  }
};

module.exports = { sendOtpEmail, sendPasswordResetEmail };
