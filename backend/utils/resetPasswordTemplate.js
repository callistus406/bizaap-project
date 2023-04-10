function emailTemplate(username, email, resetUrl) {
  return `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
  </head>
  <body>
    <table align="center" cellpadding="0" cellspacing="0" width="600">
      <tr>
        <td bgcolor="#f5f5f5" style="padding: 40px 30px 40px 30px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="text-align: center;">
                <h1 style="color: #2f2f2f;">Reset Password</h1>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px; color: #2f2f2f;">
                <p>Dear ${email},</p>
                <p>We have received a request to reset your password. If you did not request this, please ignore this email.</p>
                <p>To reset your password, please click the following link:</p>
                <p><a href="${resetUrl}" style="color: #007bff;">Reset Password</a></p>
                <p>If the link does not work, please copy and paste the following URL into your browser:</p>
                <p>${resetUrl}</p>
                <p style="padding-top: 20px;">Thank you,</p>
                <p>The Tiza Team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

        
        `;
}

module.exports = { emailTemplate };
