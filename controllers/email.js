const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: process.env.M_USER,
    pass: process.env.M_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: '"Wiola test 👻" <contact@contact.com>',
    to: email,
    subject: "Verify your email",
    html: `<a href="$localhost:3000/api/users/verify/${verificationToken}">Verify your email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
