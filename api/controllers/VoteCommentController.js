/**
 * VoteCommentController.js
 *
 * @description :: Server-side logic for managing likes for comments.
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
     * @api {post} /comment/:comment/upvote Upvote a Comment
     * @apiName UpvoteComment
     * @apiGroup Vote Comment
     *
     * @apiDescription Serve per dare un voto positivo (+1) ad un commento.
     * Visto che ogni voto deve avere un autore, si deve inviare qualsiasi
     * richiesta con il token del suo autore.<br>
     * Non sono richiesti parametri. 
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} vote JSON that represents the upvote object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *      {
     *        "value": 1,
     *        "author": "55b275aa3e4935bc028d02c0",
     *        "comment": "55cc9b54e75edbb10e65089c",
     *        "createdAt": "2015-09-09T09:53:20.041Z",
     *        "updatedAt": "2015-09-09T09:53:20.041Z",
     *        "id": "55f00190b6aecd11065cab85"
     *      }
     *     }
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    createUpvote: function (req, res, next) {
        sails.controllers.votecomment.create(req, res, next, 1);

    },

    /**
     * @api {post} /comment/:comment/downvote Downvote a Comment
     * @apiName DownvoteComment
     * @apiGroup Vote Comment
     *
     * @apiDescription Serve per dare un voto negativo (-1) ad un commento.
     * Visto che ogni voto deve avere un autore, si deve inviare qualsiasi
     * richiesta con il token del suo autore.<br>
     * Non sono richiesti parametri. 
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} vote JSON that represents the upvote object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *      {
     *        "value": -1,
     *        "author": "55b275aa3e4935bc028d02c0",
     *        "comment": "55cc9b54e75edbb10e65089c",
     *        "createdAt": "2015-09-09T09:53:20.041Z",
     *        "updatedAt": "2015-09-09T09:53:20.041Z",
     *        "id": "55f00190b6aecd11065cab85"
     *      }
     *     }
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    createDownvote: function (req, res, next) {
        sails.controllers.votecomment.create(req, res, next, -1);
    },

   /**
   * Azione per creare un voto (+1 o -1) ad un commento.
   * Questa azione non premette di avere due voti della stessa persona.
   */
    create: function (req, res, next, value) {
        var user = req.payload;

        // completo l'oggetto voteComment
        var voteComment = { value: value, author: user, comment: req.comment.id };

        //cerco se c'è gia uno stesso vote
        VoteComment.find()
            .where({ author: user.id, comment: req.comment.id })
            .exec(function (err, voteComments) {
                if (err) { return next(err); }

                if (voteComments.length == 0) {// non trovato, quindi ne posso creare uno
                    VoteComment.create(voteComment).exec(function (err, voteCommentCreated) {
                        if (err) { return next(err); }

                        // Notifico l'evento all'utente autore del comment
                        Notification.notifyUser(user.id, req.comment.user, voteCommentCreated, 'VoteComment');

                        return res.json(voteCommentCreated);
                    });
                } else {// trovato!
                    if (voteComments[0].value != voteComment.value) {// se diverso
                        VoteComment.destroy(voteComments[0].id).exec(function (err) {// cancello quello vecchio
                            if (err) { return next(err); }
                            VoteComment.create(voteComment).exec(function (err, voteCommentCreated) {
                                if (err) { return next(err); }

                                // Notifico l'evento all'utente autore del comment
                                Notification.notifyUser(user.id, req.comment.user, voteCommentCreated, 'VoteComment');

                                return res.json(voteCommentCreated);
                            });
                        });
                    }// se uguale allora non faccio nulla
                    else { return res.json(voteComments[0]); }
                }
            });
    },

    /**
     * @api {delete} /comment/:comment/vote Delete a generic vote from Comment
     * @apiName DeleteVoteComment
     * @apiGroup Vote Comment
     *
     * @apiDescription Serve eliminare un voto generico (positivo o negativo) ad un commento.
     * Visto che ogni voto deve avere un autore, si deve inviare qualsiasi
     * richiesta con il token del suo autore.<br>
     * Non sono richiesti parametri. 
     *
     * @apiUse TokenHeader
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 204 No Content
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoPermissionError
     *
     * @apiUse NoCommentError
     */
    destroy: function (req, res, next) {
        var user = req.payload;

        var voteCommentToDelete = { author: user.id, comment: req.comment.id };

        VoteComment
            .destroy(voteCommentToDelete)
            .exec(function (err) {
                if (err) { return next(err); }

                return res.send(204, null);// eliminato
            });
    },

    /**
     * @api {get} /comment/:comment/upvote List the upvotes for a Comment
     * @apiName GetUpvotesComment
     * @apiGroup Vote Comment
     *
     * @apiDescription Serve a richiedere la lista di voti positivi di un commento.
     * <br>
     * Non sono richiesti ne parametri ne le credenziali dell'utente. 
     *
     * @apiSuccess {Array} vote_list Array that represents positive votes
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *  [
     *    {
     *      "author": {
     *        "username": "cavallo",
     *        "createdAt": "2015-07-24T17:28:10.577Z",
     *        "updatedAt": "2015-07-24T17:28:10.577Z",
     *        "id": "55b275aa3e4935bc028d02c0"
     *    },
     *      "comment": "55cc9b54e75edbb10e65089c",
     *      "value": 1,
     *      "createdAt": "2015-09-09T09:53:20.041Z",
     *      "updatedAt": "2015-09-09T09:53:20.041Z",
     *      "id": "55f00190b6aecd11065cab85"
     *    }
     *  ]
     *
     * @apiUse NoCommentError
     */
    findUpvotes: function (req, res, next) {
        
        VoteComment.find()
            .where({ comment: req.comment.id, value: 1 })
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('author')
            .exec(function (err, voteComments) {
                if (err) { return next(err); }

                return res.json(voteComments);
            });
    },

    /**
     * @api {get} /comment/:comment/downvote List the downvotes for a Comment
     * @apiName GetDownvotesComment
     * @apiGroup Vote Comment
     *
     * @apiDescription Serve a richiedere la lista di voti negativi di un commento.
     * <br>
     * Non sono richiesti ne parametri ne le credenziali dell'utente. 
     *
     * @apiSuccess {Array} vote_list Array that represents negative votes
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *  [
     *    {
     *      "author": {
     *        "username": "cavallo",
     *        "createdAt": "2015-07-24T17:28:10.577Z",
     *        "updatedAt": "2015-07-24T17:28:10.577Z",
     *        "id": "55b275aa3e4935bc028d02c0"
     *    },
     *      "comment": "55cc9b54e75edbb10e65089c",
     *      "value": -1,
     *      "createdAt": "2015-09-09T09:53:20.041Z",
     *      "updatedAt": "2015-09-09T09:53:20.041Z",
     *      "id": "55f00190b6aecd11065cab85"
     *    }
     *  ]
     *
     * @apiUse NoCommentError
     */
    findDownvotes: function (req, res, next) {
        
        VoteComment.find()
            .where({ comment: req.comment.id, value: -1 })
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('author')
            .exec(function (err, voteComments) {
                if (err) { return next(err); }

                return res.json(voteComments);
            });
    },

    /**
     * @api {get} /comment/:comment/vote Check if you voted a Comment
     * @apiName CheckVoteComment
     * @apiGroup Vote Comment
     *
     * @apiDescription Serve a controllare se l'utente ha votato un commento.
     * <br>
     * Necessita di autenticazione.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} vote JSON that represents the vote object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *  {
     *    value: 1
     *    author: "55b275aa3e4935bc028d02c0"
     *    comment: "55cc9b54e75edbb10e65089c"
     *    createdAt: "2015-09-09T19:53:12.315Z"
     *    updatedAt: "2015-09-09T19:53:12.315Z"
     *    id: "55f08e28a489ce62116cfacf"
     *  }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoCommentError
     */
    checkVote: function (req, res, next) {
        var user = req.payload;

        VoteComment.find()
            .where({ comment: req.comment.id, author: user.id })
            .exec(function (err, voteComments) {
                if (err) { return next(err); }

                if (voteComments.length == 0) {
                    return res.status(404).send('Not found');// HTTP status 404: NotFound
                } else { return res.json(voteComments[0]); }
            });
    }

};

