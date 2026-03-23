import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface OrderDetails {
    ticketName: string;
    date: string;
    time: string;
    adults: number;
    children: number;
    totalPrice: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    sessionId: string;
}

function buildConfirmationHTML(order: OrderDetails): string {
    const orderRef = order.sessionId.slice(-10).toUpperCase();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr>
    <td style="background:#1e3a8a;padding:32px 40px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:0.5px;">Booking Confirmation</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Thank you for your purchase!</p>
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:32px 40px 16px;">
      <p style="font-size:16px;color:#111827;margin:0;">Dear <strong>${order.customerName}</strong>,</p>
      <p style="font-size:15px;color:#6b7280;margin:12px 0 0;line-height:1.6;">
        Your booking has been confirmed. Below are the details of your reservation. Please keep this email for your records.
      </p>
    </td>
  </tr>

  <!-- Order Details Card -->
  <tr>
    <td style="padding:8px 40px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;">
        <tr>
          <td style="padding:24px;">
            <h2 style="margin:0 0 16px;font-size:16px;color:#1e3a8a;font-weight:700;">Booking Details</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;width:140px;">Ticket:</td>
                <td style="padding:6px 0;font-weight:600;">${order.ticketName}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Date:</td>
                <td style="padding:6px 0;font-weight:600;">${order.date}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Entry Time:</td>
                <td style="padding:6px 0;font-weight:600;">${order.time}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Adult Tickets:</td>
                <td style="padding:6px 0;font-weight:600;">${order.adults}</td>
              </tr>
              ${order.children > 0 ? `
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Child Tickets:</td>
                <td style="padding:6px 0;font-weight:600;">${order.children}</td>
              </tr>` : ''}
              <tr>
                <td colspan="2" style="padding:12px 0 0;border-top:1px solid #e5e7eb;"></td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-weight:700;">Total Paid:</td>
                <td style="padding:6px 0;font-weight:700;font-size:16px;color:#1e3a8a;">€${order.totalPrice.toFixed(2)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Customer Details -->
  <tr>
    <td style="padding:0 40px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;">
        <tr>
          <td style="padding:24px;">
            <h2 style="margin:0 0 16px;font-size:16px;color:#1e3a8a;font-weight:700;">Customer Details</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;width:140px;">Name:</td>
                <td style="padding:6px 0;">${order.customerName}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Email:</td>
                <td style="padding:6px 0;">${order.customerEmail}</td>
              </tr>
              ${order.customerPhone ? `
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Phone:</td>
                <td style="padding:6px 0;">${order.customerPhone}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Order Reference -->
  <tr>
    <td style="padding:0 40px 32px;text-align:center;">
      <p style="font-size:13px;color:#6b7280;margin:0 0 4px;">Order Reference</p>
      <p style="font-size:18px;font-weight:700;color:#111827;margin:0;letter-spacing:1px;font-family:monospace;">${orderRef}</p>
    </td>
  </tr>

  <!-- Info Box -->
  <tr>
    <td style="padding:0 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0;font-size:14px;color:#1e40af;line-height:1.6;">
              <strong>Important:</strong> No need to print your tickets. Simply present this confirmation email or your digital ticket on your smartphone at the entrance.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">
        If you have any questions, please contact our support team.
      </p>
      <p style="margin:8px 0 0;font-size:12px;color:#d1d5db;">
        This is an automated confirmation email. Please do not reply directly.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendOrderConfirmation(order: OrderDetails): Promise<boolean> {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('SMTP credentials not configured, skipping email');
        return false;
    }

    const fromName = process.env.SMTP_FROM_NAME || 'Louvre Tickets';
    const fromEmail = process.env.SMTP_USER;

    try {
        await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: order.customerEmail,
            subject: `Booking Confirmation - ${order.ticketName}`,
            html: buildConfirmationHTML(order),
        });
        console.log(`Confirmation email sent to ${order.customerEmail}`);
        return true;
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
        return false;
    }
}
