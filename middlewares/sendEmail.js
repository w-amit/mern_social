import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5fe736bdb4c0c4",
      pass: "8d22c4e0c6d756",
    },
  });

  const mailOptions = {
    from: "5fe736bdb4c0c4",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

/*
const transporter = nodeMailer.createTransport({});

  const mailOptions = {
    from: "",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);


  These 3 steps are important whenever u are sending the mail
 */
