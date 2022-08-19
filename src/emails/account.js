const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'repozheka@gmail.com',
    subject: 'Thanks for joining us!',
    text: `Welcome to the app, ${name}. Let me know how you get along weth the app.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'repozheka@gmail.com',
    subject: 'Thank you for being with us!',
    text: `Goodbye, ${name}. I hope to see you back sometime again`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
