/**
 * FollowUserController
 *
 * @description :: Server-side logic for managing follow users action
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// libreria per gestire gli array
var _ = require('lodash');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

var updateCreationCoordinates = function (follow, req) {
    var client_ip = MyUtils.getClientIp(req);
    // Update with author position by IP
    MyUtils.getIpGeoLookup(client_ip, function (result) {
        var geoJson = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [result.longitude, result.latitude]
            },
            "properties": {}
        };
        console.log("----GEO IP------");
        console.info(geoJson);

        FollowUser.update(follow.id, { creationCoordinates: geoJson })
            .exec(function (err, updatedRecords) {});
    });
};

module.exports = {

     /**
     * @api {put} /user/:user/follow Follow a User
     * @apiName FollowUser
     * @apiGroup User
     *
     * @apiDescription Serve seguire un utente.
     * Richiede l'autenticazione della richiesta. Attenzione: non è possibile seguire se
     * stessi.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */
    create: function (req, res, next) {
        var user = req.payload;
        var userToFollow = req.user;

        // controllo se esiste già 
        FollowUser.findOne({
            follower: user.id,
            following: userToFollow.id
        }).exec(function (err, foundFollow) {
            if (err) { return next(err); }

            // Follower già registrato
            if (foundFollow) return res.badRequest();

            FollowUser.create({
                follower: user.id,
                following: userToFollow.id
            }).exec(function (err, createdFollow) {
                if (err) { return next(err); }

                // Notifico l'evento all'utente da seguire
                Notification.notifyUser(user.id, userToFollow.id, createdFollow, 'FollowUser');

                // Aggiorno il follow con la posizione del client
                updateCreationCoordinates(createdFollow, req);

                return res.send(204, null);// OK - No Content
            });

        });

    },

    /**
     * @api {delete} /user/:user/follow Unfollow a User
     * @apiName UnfollowUser
     * @apiGroup User
     *
     * @apiDescription Serve non seguire più un utente.
     * Richiede l'autenticazione della richiesta.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */

    destroy: function (req, res, next) {
        var requestedUser = req.user;

        FollowUser.destroy({
            following: requestedUser.id,
            follower: req.payload.id
        }).exec(function (err) {
            if (err) { return next(err); }

            return res.send(204, null);// OK - No Content
        });

    },

    /**
     * @api {get} /user/:user/follower List followers of a User
     * @apiName FollowerUser
     * @apiGroup User
     *
     * @apiDescription Serve per ricavare la lista degli utenti che seguono un utente.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     *
     * @apiUse NoUserError
     */
    getFollowers: function (req, res, next) {
        var requestedUser = req.user;

        FollowUser.find({
            following: requestedUser.id
        }).exec(function (err, foundFollowers) {
            if (err) { return next(err); }

            if (foundFollowers.length == 0) return res.notFound('No follower found');

            var followersList = foundFollowers.map(function(elem) {
                return elem.follower;
            });
            console.info("followersList: ", followersList);

            // find users
            UserService.find(req, res, next, followersList, "");
        });

    },

    /**
     * @api {get} /user/:user/following List users followed by a User
     * @apiName FollowingUser
     * @apiGroup User
     *
     * @apiDescription Serve ricavare la lista degli utenti seguiti da un utente.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     *
     * @apiUse NoUserError
     */
    getFollowing: function (req, res, next) {
        var requestedUser = req.user;

        FollowUser.find({
            follower: requestedUser.id
        }).exec(function (err, foundFollowing) {
            if (err) { return next(err); }

            if (foundFollowing.length == 0) return res.notFound('No following found');

            var followingList = foundFollowing.map(function(elem) {
                return elem.following;
            });
            console.info("followingList: ", followingList);

            // find users
            UserService.find(req, res, next, followingList, "");
        });
    },

    /**
     * @api {get} /user/following/:user Check if you are following a User
     * @apiName AreYouFollowing
     * @apiGroup User
     *
     * @apiDescription Serve per verificare se l'utente chiamante sta segundo un altro.
     * Richiede l'autenticazione della richiesta.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 404 Not Found
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */
    areYouFollowing: function (req, res, next) {
        var user = req.payload;
        var targetUser = req.user;

        // ricarico l'utente corrente (necessario...)
        FollowUser.findOne({
            follower: user.id,
            following: targetUser.id
        }).exec(function (err, foundFollow) {
            if (err) { return next(err); }

            // non trovato
            if (!foundFollow) { return res.notFound(); }

            return res.send(204, null);// OK - No Content
        });
    },

    /**
     * @api {get} /user/:user/following/:target_user Check if one User is following another
     * @apiName IsFollowing
     * @apiGroup User
     *
     * @apiDescription Serve per verificare se un utente sta segundo un altro.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 404 Not Found
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     */
    isFollowing: function (req, res, next) {
        var targetUser = req.param('target_user');
        if (!targetUser) { return res.badRequest(); }
        var user = req.user;

        // ricarico l'utente corrente (necessario...)
        FollowUser.findOne({
            follower: user.id,
            following: targetUser.id
        }).exec(function (err, foundFollow) {
            if (err) { return next(err); }
            
            // non trovato
            if (!foundFollow) { return res.notFound(); }

            return res.send(204, null);// OK - No Content
        });
    },

};