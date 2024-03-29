import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      const res = await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "romanpoudel325@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset password",
      html:
        emailType === "VERIFY"
          ? `<p>Click <a href="${
              process.env.DOMAIN
            }/verifyemail?token=${hashedToken}">here</a> to ${
              emailType === "VERIFY"
                ? "verify your email"
                : "reset your password"
            } or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verifyemail?token=${hashedToken}</p>`
          : `<p>Click <a href="${
              process.env.DOMAIN
            }/resetpassword?token=${hashedToken}">here</a> to ${
              emailType === "VERIFY"
                ? "verify your email"
                : "reset your password"
            } or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/resetpassword?token=${hashedToken}</p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
