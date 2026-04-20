import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_ADDRESS = process.env.RESEND_FROM || "Supportive <notifications@supportive.com.au>";

export async function sendNewApplicationEmail(options: {
  employerEmail: string;
  employerName: string;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  jobId: number;
}): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping notification");
    return;
  }

  const { employerEmail, employerName, applicantName, applicantEmail, jobTitle, jobId } = options;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://supportive.com.au"}/dashboard/company`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: employerEmail,
    subject: `New application for ${jobTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
        <div style="padding: 24px 0; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #7c3aed; font-size: 18px;">Supportive</strong>
        </div>
        <div style="padding: 24px 0;">
          <p>Hi ${employerName},</p>
          <p><strong>${applicantName}</strong> (${applicantEmail}) has applied for <strong>${jobTitle}</strong>.</p>
          <p>
            <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 24px; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 999px; font-weight: 600;">
              View in dashboard
            </a>
          </p>
          <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
            You're receiving this because you posted a role on Supportive (job #${jobId}).
          </p>
        </div>
      </div>
    `.trim(),
  });
}
