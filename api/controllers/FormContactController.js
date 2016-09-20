/**
 * FormContactService.js
 *
 * Controller per la form per contattare Tastysnap. 
 * Si occupa di inviare una email ad una lista di contatti
 * con il contenuto della form.
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'smtps.aruba.it',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'hello@tastysnap.com',
        pass: 'tastypwdsnap'
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Hello Tastysnap" <hello@tastysnap.com>', // sender address
    to: 'mariusz.wiazowski@gmail.com, teatinicristian@gmail.com', // list of receivers
    subject: 'Contact Request', // Subject line
    //text: 'Hello world?', // plaintext body
    html: '<b>Hello world ?</b>' // html body
};

module.exports = {

    contact: function (req, res, next) {

        // set string to html
        mailOptions.html = JSON.stringify(req.body);

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

        return res.send(204, null);// OK - No Content
    }
};