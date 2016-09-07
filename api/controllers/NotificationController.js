/**
 * NotificationController
 *
 * @description :: Server-side logic for managing Notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

/**
 * Module dependencies
 * 
 * Prese da https://github.com/balderdashy/sails/blob/master/lib/hooks/blueprints/actions/find.js
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

	/**
     * @api {post} /user/notification Find user notifications
     * @apiName findUserNotification
     * @apiGroup Notification
     *
     * @apiDescription Serve per registare richiedere una lista di notifiche
     * destinate all'utente autenticato. 
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad request
     * 
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    find: function (req, res, next) {
        var user = req.payload;

        // Forzo la ricerca di notifiche soltanto per l'utente autenticato
        var criteria = actionUtil.parseCriteria(req) || {};
        criteria['affectedUser'] = user.id;

        Notification.find()
            .where(criteria)
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('triggeringUser')
            .exec(function (err, foundNotifications) {
                if (err) { return next(err); }

                if (foundNotifications.length == 0) {
                    return res.notFound({ error: 'No notification found' });
                }

                // per ogni notifica populo il campo 'event' a secondo del type
                async.each(foundNotifications, function (notification, callback) {
                    sails.models[notification.type.toLowerCase()].findOne(notification.event).exec(function (err, result) {
                        if (err) { return callback(err); }
                        notification.event = result;
                        callback();
                    })

                }, function (err) {
                    if (err) { return next(err); }

                    return res.json(foundNotifications);
                });
            
                
            });
    },

    /**
     * @api {post} /user/activity Find user activites
     * @apiName findUserActivity
     * @apiGroup Notification
     *
     * @apiDescription Serve per registare richiedere una lista di attività
     * svolte dall'utente autenticato. 
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad request
     * 
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    findActivity: function (req, res, next) {
        var user = req.payload;

        // Forzo la ricerca di attività svolte dall'utente autenticato
        var criteria = actionUtil.parseCriteria(req) || {};
        criteria['triggeringUser'] = user.id;

        Notification.find()
            .where(criteria)
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('affectedUser')
            .exec(function (err, foundActivities) {
                if (err) { return next(err); }

                if (foundActivities.length == 0) {
                    return res.notFound({ error: 'No notification found' });
                }

                // per ogni notifica populo il campo 'event' a secondo del type
                async.each(foundActivities, function (notification, callback) {
                    sails.models[notification.type.toLowerCase()].findOne(notification.event).exec(function (err, result) {
                        if (err) { return callback(err); }
                        notification.event = result;
                        callback();
                    })

                }, function (err) {
                    if (err) { return next(err); }

                    return res.json(foundActivities);
                });
            
                
            });
    },

    /**
     * @api {put} /user/notification/red Set user notifications to red
     * @apiName redUserNotification
     * @apiGroup Notification
     *
     * @apiDescription Serve per settare un array di notifiche come letto.
     *
     * @apiParam {Array} notificationIds Array containing notifications ids.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad request
     * 
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    red: function (req, res, next) {

        var notificationIds = req.body.notificationIds;
        if (!notificationIds) { return next(); }

        Notification
            .update(notificationIds, {red: true})
            .exec(function (err, updatedNotifications) {
                if (err) { return next(err); }
            
                return res.json(204, null);// OK - No Content
        });
        
    },

    /**
     * @api {put} /user/notification/not_red Set user notifications to not red
     * @apiName notRedUserNotification
     * @apiGroup Notification
     *
     * @apiDescription Serve per settare un array di notifiche come non letto.
     *
     * @apiParam {Array} notificationIds Array containing notifications ids.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad request
     * 
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    notRed: function (req, res, next) {

        var notificationIds = req.body.notificationIds;
        if (!notificationIds) { return next(); }

        Notification
            .update(notificationIds, {red: false})
            .exec(function (err, updatedNotifications) {
                if (err) { return next(err); }
            
                return res.json(204, null);// OK - No Content
        });
        
    },
	
};

