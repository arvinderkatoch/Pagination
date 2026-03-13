const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,

    //host: "smtp.mailtrap.io",
    port: process.env.EMAL_PORT,
    secure: false,
    logger: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Arvinder katoch <arvinderkatoch02@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  await transport.sendMail(mailOptions);
  //3) Actually send the email
};

module.exports = sendEmail;
