const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");

// templates
const emailWelcome = require("../templates/emails/emailWelcome");
const emailPasswordReset = require("../templates/emails/emailPasswordReset");

// new Email(user, url, data)
module.exports = class Email {
  constructor(user, url, data) {
    this.from = `Artem Nikolaiev <${process.env.EMAIL_FROM}>`;
    this.to = user.email;
    this.user = user;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.data = data;
  }

  // create transport
  // prod - sendgrid
  // dev - mailtrap
  _createNewTransport() {
    if (process.env.NODE_ENV === "production") {
      // sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // mailtrap
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // send email
  async send(template, subject) {
    // get html template
    const html = template(this.user, this.url, this.data);

    // define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: htmlToText.fromString(html),
      html: html,
    };

    // create transport and send email
    const transport = this._createNewTransport();
    await transport.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(emailWelcome, "Welcome to Task Manager!");
  }

  async sendPasswordReset() {
    await this.send(emailPasswordReset, "Forgot your password?");
  }
};
