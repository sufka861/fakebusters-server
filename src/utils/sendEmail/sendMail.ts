import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import ejs from "ejs";
import { config } from "dotenv";

config();

interface EmailDetails {
  templatePath: string;
  subject: string;
  recipientEmail: string;
}

const sendEmail = async (
  emailDetails: EmailDetails,
  templateData: object,
): Promise<void> => {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    }),
  );

  const emailContent = await ejs.renderFile(
    process.cwd() + emailDetails.templatePath,
    templateData,
  );
  const mailOptions = {
    from: "fakebusters.shenkar@gmail.com",
    to: emailDetails.recipientEmail,
    subject: emailDetails.subject,
    html: emailContent,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(`Email transport error: ${error.message}`);
    } else {
      console.log("Email was sent successfully");
    }
  });
};

// user: User
const notifyUserByEmail = async (
  name: string,
  userEmail: string,
): Promise<void> => {
  const emailDetails: EmailDetails = {
    templatePath: "/src/utils/sendEmail/sendEmail.ejs",
    subject: "Fakebusters Analysis Result",
    recipientEmail: userEmail,
  };

  const templateData = {
    userName: name,
  };
  await sendEmail(emailDetails, templateData);
};

export { sendEmail, notifyUserByEmail };
