/**
 * isNotificationRecipient.js
 *
 * Questa è una politica che si occupa di verificare se l'utente che vuole eseguire
 * una update su una risorsa è il destinatario di tale risorsa (notifica).
 *
 * ATTENZIONE: si deve implementarla per ogni Model che si ritiene opportuno.
 *
 * @description :: Policy to check if user is authorized to update a resource.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function(req, res, next) {
    var user = req.payload;

    var notificationIds = req.body.notificationIds;
        if (!notificationIds) { return next(); }

    Notification
        .find({
            id: notificationIds,
            affectedUser: user.id
        })
        .exec(function(err, notifications) {
            if (err) { return next(err); }

            if (!notifications) { return res.notFound({ error: 'No notifications found' }); }

            if (notificationIds.length == notifications.length) {
                next();
            } else
                return res.badRequest();

        });

};