'use strict'
//
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

//create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: "notifications.speeder@gmail.com",
    pass: "atSpeedER"
  }
}));


/*
  example usage:
  sendNotification({
    to: "example@email.com",
    subject: "NOTIFICATION: XX",
    text: "This is an important message!"
  })
 */

module.exports = {
  sendNotification: function(fields) {
    transporter.sendMail({
      from: "notifications.speeder@gmail.com",
      to: fields.to,
      subject: fields.subject,
      text: fields.text
    })
  }
}
