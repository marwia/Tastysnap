/**
 * CommentController.js
 *
 * @description :: Server-side logic for managing comments
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
   * @api {post} /recipe/:recipe/comment Comment a Recipe
   * @apiName CommentRecipe
   * @apiGroup Comment Recipe
   *
   * @apiDescription Serve per dare un commento testuale ad una ricetta.
   * Visto che ogni commento deve avere un autore, si deve inviare qualsiasi
   * richiesta con il token del suo autore.<br>
   * Nei parametri della richiesta va inserito il corpo del commento. 
   *
   * @apiUse TokenHeader
   *
   * @apiParam {String} body The comment's body.
   *
   * @apiSuccess {json} comment JSON that represents the comment object.
   *
   * @apiSuccessExample {json} Success-Response-Example:
   *     HTTP/1.1 200 OK
   *     {
   *      {
   *        "body": "Ottima ricetta",
   *        "user": "55b275aa3e4935bc028d02c0",
   *        "recipe": "55cc9b54e75edbb10e65089c",
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
   *
   * @apiUse NoRecipeError
   */
    create: function(req, res, next) {
        var user = req.payload;

        var commentBody = req.body.body;

        var comment = { body: commentBody, user: user, recipe: req.recipe }

        Comment.create(comment).exec(function(err, createdComment) {
            if (err) { return next(err); }

            // Notifico l'evento all'utente autore della raccolta
            Notification.notifyUser(user.id, req.recipe.author, createdComment, 'Comment');

            return res.json(createdComment);
        });

    },

    /**
     * @api {put} /recipe/:recipe/comment/:comment Modify a comment
     * @apiName ModifyComment
     * @apiGroup Comment Recipe
     *
     * @apiDescription Serve per dare modificare il corpo di un commento.
     * Necessità di autorizzazione e di essere l'autore del commento.<br>
     * Nei parametri della richiesta va inserito il corpo del commento. 
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} body The comment's body.
     *
     * @apiSuccess {json} comment JSON that represents the comment object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *      {
     *        "body": "Ottima ricetta, complimenti!",
     *        "user": "55b275aa3e4935bc028d02c0",
     *        "recipe": "55cc9b54e75edbb10e65089c",
     *        "createdAt": "2015-09-09T09:53:20.041Z",
     *        "updatedAt": "2015-09-09T09:59:20.041Z",
     *        "id": "55f00190b6aecd11065cab85"
     *      }
     *     }
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoPermissionError
     *
     * @apiUse NoRecipeError
     */
    update: function(req, res, next) {
        var commentId = req.param('id');// l'id è un parametro

        if (!commentId) { return next(); }

        var newComment = { body: req.body.body }

        Comment.update({ id: commentId, recipe: req.recipe.id }, newComment).exec(function(err, updatedComments) {
            if (err) { return next(err); }

            return res.json(updatedComments[0]);
        });
    },

    /**
     * @api {delete} /recipe/:recipe/comment/:comment Delete a comment
     * @apiName DeleteComment
     * @apiGroup Comment Recipe
     *
     * @apiDescription Serve per dare eliminare un commento.
     * Necessità di autorizzazione e di essere l'autore del commento.<br>
     * Nei parametri della richiesta va inserito il corpo del commento. 
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} comment JSON that represents the comment object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
          {
            "user": {
              "username": "cavallo",
              "createdAt": "2015-09-15T13:59:50.559Z",
              "updatedAt": "2015-09-15T13:59:50.559Z",
              "id": "55f8245674cb8184028877b9"
            },
            "recipe": {
              "title": "Carbonara senza uova",
              "description": "Procedere cosi...",
              "author": "55f8245674cb8184028877b9",
              "createdAt": "2015-09-15T14:01:17.587Z",
              "updatedAt": "2015-09-15T14:01:17.587Z",
              "id": "55f824ad74cb8184028877ba"
            },
            "body": "<p>Could he somehow make the shape of an \"S\" with his arms? I feel like i see potential for some hidden shapes in here...</p>\n\n<p>Looks fun!\n</p>",
            "createdAt": "2015-09-15T19:25:50.688Z",
            "updatedAt": "2015-09-15T19:25:50.688Z",
            "id": "55f870be79df96670817ad7a"
          }
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoPermissionError
     *
     * @apiUse NoRecipeError
     */

    /**
     * @api {get} /recipe/:recipe/comment List comments for a Recipe
     * @apiName GetCommentsRecipe
     * @apiGroup Comment Recipe
     *
     * @apiDescription Serve a richiedere la lista dei commenti di una ricetta.
     * <br>
     * Non sono richiesti ne parametri ne le credenziali dell'utente. 
     *
     * @apiSuccess {json} recipe JSON that represents the list.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *  [
          {
            "user": {
              "username": "cavallo",
              "createdAt": "2015-09-15T13:59:50.559Z",
              "updatedAt": "2015-09-15T13:59:50.559Z",
              "id": "55f8245674cb8184028877b9"
            },
            "recipe": "55f824ad74cb8184028877ba",
            "body": "Bono!!",
            "createdAt": "2015-09-15T14:32:01.067Z",
            "updatedAt": "2015-09-15T14:35:18.559Z",
            "id": "55f82be1c62852850347a9a2"
          },
          {
            "user": {
              "username": "cavallo",
              "createdAt": "2015-09-15T13:59:50.559Z",
              "updatedAt": "2015-09-15T13:59:50.559Z",
              "id": "55f8245674cb8184028877b9"
            },
            "recipe": "55f824ad74cb8184028877ba",
            "body": "Ciao!",
            "createdAt": "2015-09-15T14:39:14.569Z",
            "updatedAt": "2015-09-15T14:39:14.569Z",
            "id": "55f82d926314879e03dcfcd5"
          },
          {
            "user": {
              "username": "cavallo",
              "createdAt": "2015-09-15T13:59:50.559Z",
              "updatedAt": "2015-09-15T13:59:50.559Z",
              "id": "55f8245674cb8184028877b9"
            },
            "recipe": "55f824ad74cb8184028877ba",
            "body": "<p>Could he somehow make the shape of an \"S\" with his arms? I feel like i see potential for some hidden shapes in here...</p>\n\n<p>Looks fun!\n</p>",
            "createdAt": "2015-09-15T19:25:50.688Z",
            "updatedAt": "2015-09-15T19:25:50.688Z",
            "id": "55f870be79df96670817ad7a"
          }
        ]
     *
     * @apiUse NoRecipeError
     */
    find: function(req, res, next) {
        Comment.find()
            .where({ recipe: req.recipe.id })
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('user')
            .populate('votes')
            .exec(function(err, foundComments) {
                if (err) { return next(err); }

                if (foundComments.length == 0) {
                    return res.notFound({ error: 'No comment found' });
                }

                // array di appoggio
                var comments = new Array();

                // conto gli elementi delle collection
                for (var i in foundComments) {
                    
                    foundComments[i].upvotesCount = 0;
                    foundComments[i].downvotesCount = 0;
                    for (var k in foundComments[i].votes) {
                        if (foundComments[i].votes[k].value == 1) {
                            foundComments[i].upvotesCount++;
                        }
                        else if (foundComments[i].votes[k].value == -1) {
                            foundComments[i].downvotesCount++;
                        }
                    }
                    /**
                     * Tolgo gli elementi popolati
                     */
                    var obj = foundComments[i].toObject();
                    delete obj.votes;
                    comments.push(obj);
                }
                return res.json(comments);
            });
    },

    /**
     * @api {get} /recipe/:recipe/comment/:comment Get a comment for a Recipe
     * @apiName GetCommentRecipe
     * @apiGroup Comment Recipe
     *
     * @apiDescription Serve a richiedere un particolare commento di una ricetta.
     * <br>
     * Non sono richiesti ne parametri ne le credenziali dell'utente. 
     *
     * @apiSuccess {json} recipe JSON that represents the comment.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
        {
          "user": {
            "username": "cavallo",
            "createdAt": "2015-09-15T13:59:50.559Z",
            "updatedAt": "2015-09-15T13:59:50.559Z",
            "id": "55f8245674cb8184028877b9"
          },
          "recipe": "55f824ad74cb8184028877ba",
          "body": "Bono!!",
          "createdAt": "2015-09-15T14:32:01.067Z",
          "updatedAt": "2015-09-15T14:35:18.559Z",
          "id": "55f82be1c62852850347a9a2"
        }
     *
     * @apiUse NoRecipeError
     */
    findOne: function(req, res, next) {
        var commentId = req.param('id');
        if (!commentId) { return next(); }

        Comment.findOne(commentId)
            .populate('user')
            .populate('votes')
            .exec(function(err, foundComment) {
                if (err) { return next(err); }

                if (!foundComment) { return res.notFound({ error: 'No comment found' }); }

                // conteggio dei voti
                foundComment.upvotesCount = 0;
                foundComment.downvotesCount = 0;
                for (var k in foundComment.votes) {
                    if (foundComment.votes[k].value > 0) {
                        foundComment.upvotesCount++;
                    }
                    else {
                        foundComment.downvotesCount++;
                    }
                }

                /**
                 * Tolgo gli elementi popolati.
                 */
                var obj = foundComment.toObject();
                delete obj.votes

                return res.json(obj);
            });
    }



};

