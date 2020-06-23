const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1 make transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2 define email options
  const mailOptions = {
    from: 'Dean Flanagan <mickie@timmy.ass>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  console.log('                      ***');
  //   console.log(transporter);
  // 3 send the message
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
// try {
//   sendEmail({ email: 'mick@timm.ass', subject: 'Your password reset token for 10 mniutes', message: 'Hi dean' });
// } catch (err) {
//   console.log(err);
// }
