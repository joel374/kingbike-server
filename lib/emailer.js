const nodemailer = require("nodemailer");

const emailer = async ({ to, subject, text, html }) => {
  if (!to) {
    throw new Error("Emailer needs recipient email. `to` parameter is missing");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // gunakan false untuk port 587 (TLS akan di-upgrade otomatis)
    auth: {
      user: "kingbike.business@gmail.com",
      pass: "xedxyycewtxqoglu",
    },
  });

  await transporter.sendMail({
    to,
    subject,
    text,
    html,
  });
};

module.exports = emailer;
