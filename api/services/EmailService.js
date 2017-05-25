/**
 * EmailService.js
 *
 * Si occupa di inviare email ad una lista di contatti.
 *
 * @description :: Email Service for sails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');

var smtpConfig = {
    host: 'smtps.aruba.it',
    port: 465,
    secure: true, // use SSL
    pool: true,
    maxConnections: 2,
    auth: {
        user: 'hello@tastysnap.com',
        pass: 'tastypwdsnap'
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

var sendNotificationEmail = function (userAddress, subject, userName, message, actionTitle, actionLink) {
    console.log("sono dentro al metodo email");

    readHTMLFile('assets/email_templates/email_notification.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            userName: userName,
            subject: subject,
            message: message,
            actionTitle: actionTitle,
            actionLink: actionLink
        };
        var htmlToSend = template(replacements);

        var mailOptions = {
            from: '"Hello Tastysnap" <hello@tastysnap.com>', // sender address
            to: userAddress, // list of receivers
            subject: subject, // Subject line
            html: htmlToSend
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            console.log("sono dentro il metodo sendMail");
            if (error) {
                console.log("errore nell'invio della mail");
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

    });
};

module.exports = {

    /**
     * Notifica allo staff.
     */
    sendProductToBeCompletedNotification: function (product) {
        // ricerco gli 
        UserPermission
            .find({ type: 'admin' })
            .exec(function (err, foundUsers) {
                if (err) { return next(err); }

                if (foundUsers.length > 0) {
                    for (var i = 0; i < foundUsers.length; i++) {
                        console.log("Mando email perchè c'è un prodotto da completare...");

                        sendNotificationEmail(
                            foundUsers[i].email,
                            "Nuovo prodotto da completare",
                            "membro dello staff",
                            "E' stato creato un nuovo prodotto e deve essere completato dallo staff.",
                            product.name.long,
                            "http://tastysnap.com/admin/product_mngmnt");
                    }
                }

            });
    },

    /**
     * Notifica allo staff.
     */
    sendRecipeToBeValidateNotification: function (recipe) {
        // ricerco gli 
        UserPermission
            .find({ type: 'admin' })
            .exec(function (err, foundUsers) {
                if (err) { return next(err); }

                    if (foundUsers.length > 0) {
                    for (var i = 0; i < foundUsers.length; i++) {
                        console.log("Mando email perchè c'è una ricetta è da validare...");

                        sendNotificationEmail(
                            foundUsers[i].email,
                            "Nuova ricetta da validare",
                            "membro dello staff",
                            "E' stata creata una nuova ricetta e deve essere validata dallo staff.",
                            recipe.title,
                            "http://tastysnap.com/api/v1/recipe/"+recipe.id);
                    }
                }
                

            });
    },

    /**
     * Notifica all'autore della ricetta.
     */
    sendRecipeChangeIngredientStateNotification: function (recipe) {
        User
            .findOne(recipe.author.id ? recipe.author.id : recipe.author)
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (foundUser) {
                    console.log("Mando email perchè la ricetta ha cambiato stato...");

                    if (recipe.ingredientState == 'ok') {
                        sendNotificationEmail(
                                foundUser.email,
                                "Ottime notizie! La tua ricetta è ora visibile!",
                                foundUser.name,
                                "La tua ricetta "+recipe.title+" è stata accettata ed ora è visibile a tutti.",
                                recipe.title,
                                "http://tastysnap.com/api/v1/recipe/"+recipe.id);

                    } else if (recipe.ingredientState == 'notValid') {
                        sendNotificationEmail(
                                foundUser.email,
                                "Pessime notizie! La tua ricetta è stata rifiutata...",
                                foundUser.name,
                                "La tua ricetta "+recipe.title+" è stata rifiutata perchè viola i Termini di Servizio di Tastysnap. Per maggiori chiarimenti puoi rispondere a questa email.",
                                recipe.title,
                                "http://tastysnap.com/api/v1/recipe/"+recipe.id);
                    }
                }

            });
    },

}