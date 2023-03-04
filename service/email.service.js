const sgMail = require('@sendgrid/mail');

const sendGridApiKey = process.env.sendGridApiKey

sgMail.setApiKey(sendGridApiKey);

const sendEmail = (to, subject, text, html) => {
  try {
    const msg = {
      to, 
      from: process.env.sendGridApiSender, // Change to your verified sender
      subject,
      text,
      html,
    };
    sgMail
      .send(msg)
      .then(() => {
       
        console.log('Email sent');
      })
      .catch((error) => {
        console.log(error.response.body);
      });
  } catch (err) {
    console.log('Something Failed');
    return err;
  }
};

module.exports = { sendEmail };
