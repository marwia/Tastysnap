/**
 * FollowCollectionController
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// libreria per gestire gli array
var _ = require('lodash');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

    /**
    * @api {put} /collection/:collection/follow Follow a Collection
    * @apiName FollowCollection
    * @apiGroup Collection
    *
    * @apiDescription Serve seguire una collezione.
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
    *
    * @apiUse NoCollectionError
    */
    create: function (req, res, next) {
        var user = req.payload;
        var collectionToFollow = req.collection;

        // controllo se esiste già 
        FollowCollection.findOne({
            collection: collectionToFollow.id,
            user: user.id
        }).exec(function (err, foundFollow) {
            if (err) { return next(err); }

            if (foundFollow) return res.badRequest();

            FollowCollection.create({
                collection: collectionToFollow,
                user: user
            }).exec(function (err, createdFollow) {
                if (err) { return next(err); }
                return res.send(204, null);// OK - No Content
            });

        });

    },

    /**
     * @api {delete} /collection/:collection/follow Unfollow a Collection
     * @apiName UnfollowCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve non seguire più una collezione.
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
     *
     * @apiUse NoCollectionError
     */

    destroy: function (req, res, next) {
        var followedCollection = req.collection;

        FollowCollection.destroy({
            collection: followedCollection.id,
            user: req.payload.id
        }).exec(function (err) {
            if (err) { return next(err); }

            return res.send(204, null);// OK - No Content
        });

    },

    /**
     * @api {get} /collection/:collection/follower List followers of a Collection
     * @apiName FollowerCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per ricavare la lista degli utenti che seguono una collezione.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     *
     * @apiUse NoCollectionError
     */
    getCollectionFollowers: function (req, res, next) {
        var collectionId = req.param('collection');
        if (!collectionId) { return next(); }

        FollowCollection.find({ collection: collectionId }).populate('user').exec(function (err, foundFollowCollections) {
            if (err) { return next(err); }

            if (foundFollowCollections.length == 0) {
                return res.notFound({ error: 'No followers found' });
            }

            return res.json(foundFollowCollections);
        });
    },

    /**
     * @api {get} /user/:id/following_collections Get a User following collection list
     * @apiName getUserFollowingCollections
     * @apiGroup User
     *
     * @apiDescription Serve per richiedere la lista di raccolte
     * seguite da un utente.
     *
     * @apiParam {String} id User id.
     *
     * @apiSuccess {[CollectionObject]} collectionList JSON that represents the list of collections.
     *
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     */
    findUserFollwingCollections: function (req, res, next) {
        var userId = req.param('id');
        if (!userId) { return next(); }

        FollowCollection.find({ user: userId })
            .exec(function (err, foundFollowCollections) {
                if (err) { return next(err); }

                if (!foundFollowCollections) { return res.notFound({ error: 'No collection found' }); }
            
                // Array con id di ricette provate
                var followingCollections = new Array();

                for (var i in foundFollowCollections) {
                    followingCollections.push(foundFollowCollections[i].collection)
                }

                // find recipes
                CollectionService.find(req, res, next, followingCollections);
            });
    },

    /**
     * @api {get} /collection/:collection/following Check if you are following a Collection
     * @apiName AreYouFollowingCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per verificare se l'utente chiamante sta segundo una Collezione.
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
     * @apiUse NoCollectionError
     */
    areYouFollowing: function (req, res, next) {
        var user = req.payload;
        var targetCollection = req.collection;

        // ricarico l'utente corrente (necessario...)
        FollowCollection.findOne({
            collection: targetCollection.id,
            user: user.id
        }).exec(function (err, foundFollow) {
            if (err) { return next(err); }

            if (!foundFollow) { return res.notFound(); }

            return res.send(204, null);// OK - No Content
        });
    },


};