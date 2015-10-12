/**
 * VoteRecipeController.js
 *
 * @description :: Server-side logic for managing likes for recipes.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /**
   * @api {post} /recipe/:recipe/upvote Upvote a Recipe
   * @apiName UpvoteRecipe
   * @apiGroup Vote Recipe
   *
   * @apiDescription Serve per dare un voto positivo (+1) ad una ricetta.
   * Visto che ogni voto deve avere un autore, si deve inviare qualsiasi
   * richiesta con il token del suo autore.<br>
   * Non sono richiesti parametri. 
   *
   * @apiUse TokenHeader
   *
   * @apiSuccess {json} recipe JSON that represents the upvote object.
   *
   * @apiSuccessExample {json} Success-Response-Example:
   *     HTTP/1.1 200 OK
   *     {
   *      {
   *        "value": 1,
   *        "author": "55b275aa3e4935bc028d02c0",
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
   */
  createUpvote: function (req, res, next) {
    sails.controllers.voterecipe.create(req, res, next, 1);

  },

  /**
   * @api {post} /recipe/:recipe/downvote Downvote a Recipe
   * @apiName DownvoteRecipe
   * @apiGroup Vote Recipe
   *
   * @apiDescription Serve per dare un voto negativo (-1) ad una ricetta.
   * Visto che ogni voto deve avere un autore, si deve inviare qualsiasi
   * richiesta con il token del suo autore.<br>
   * Non sono richiesti parametri. 
   *
   * @apiUse TokenHeader
   *
   * @apiSuccess {json} recipe JSON that represents the upvote object.
   *
   * @apiSuccessExample {json} Success-Response-Example:
   *     HTTP/1.1 200 OK
   *     {
   *      {
   *        "value": -1,
   *        "author": "55b275aa3e4935bc028d02c0",
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
   */
  createDownvote: function (req, res, next) {
    sails.controllers.voterecipe.create(req, res, next, -1);
  },

	/**
   * Azione per creare un voto (+1 o -1) ad una ricetta.
   * Questa azione non premette di avere due voti della stessa persona.
   */
	create: function (req, res, next, value) {
    var user = req.payload;

    // completo l'oggetto voteRecipe
    var voteRecipe = {value: value, author: user, recipe: req.recipe.id };

    //cerco se c'è gia uno stesso vote
    VoteRecipe.find().where({ author: user.id, recipe: req.recipe.id })
      .exec(function (err, voteRecipes) {
        if(err){ return next(err); }

        if(voteRecipes.length == 0){// non trovato, quindi ne posso creare uno
          VoteRecipe.create(voteRecipe).exec(function (err, voteRecipeCreated){
            if(err){ return next(err); }

            return res.json(voteRecipeCreated);
          });
        } else {// trovato!
          if(voteRecipes[0].value != voteRecipe.value) {// se diverso
            VoteRecipe.destroy(voteRecipes[0].id).exec(function (err){// cancello quello vecchio
              if(err){ return next(err); }
              VoteRecipe.create(voteRecipe).exec(function (err, voteRecipeCreated){
                if(err){ return next(err); }

                return res.json(voteRecipeCreated);
              });
            });
          }// se uguale allora non faccio nulla
          else { return res.json(voteRecipes[0]); }
        }
    });
  },

  /**
   * @api {delete} /recipe/:recipe/vote Delete a generic vote from Recipe
   * @apiName DeleteVoteRecipe
   * @apiGroup Vote Recipe
   *
   * @apiDescription Serve eliminare un voto generico (positivo o negativo) ad una ricetta.
   * Visto che ogni voto deve avere un autore, si deve inviare qualsiasi
   * richiesta con il token del suo autore.<br>
   * Non sono richiesti parametri. 
   *
   * @apiUse TokenHeader
   *
   * @apiSuccess {json} recipe JSON that represents the upvote object.
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
   * @apiUse NoRecipeError
   */
  destroy: function (req, res, next) {
    var user = req.payload;

    var voteRecipeToDelete = {author: user.id, recipe: req.recipe.id};

    VoteRecipe.destroy(voteRecipeToDelete).exec(function (err){
      if(err){ return next(err); }

      return res.send(204, null);// eliminato
    })
  },

  /**
   * @api {get} /recipe/:recipe/upvote List the upvotes for a Recipe
   * @apiName GetUpvotesRecipe
   * @apiGroup Vote Recipe
   *
   * @apiDescription Serve a richiedere la lista di voti positivi di una ricetta.
   * <br>
   * Non sono richiesti ne parametri ne le credenziali dell'utente. 
   *
   * @apiSuccess {json} recipe JSON that represents the upvote object.
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
   *      "recipe": "55cc9b54e75edbb10e65089c",
   *      "value": 1,
   *      "createdAt": "2015-09-09T09:53:20.041Z",
   *      "updatedAt": "2015-09-09T09:53:20.041Z",
   *      "id": "55f00190b6aecd11065cab85"
   *    }
   *  ]
   *
   * @apiUse NoRecipeError
   */
  findUpvotes: function (req, res, next) {
    VoteRecipe.find().where({ recipe: req.recipe.id, value: 1 }).populate('author').exec( function (err, voteRecipes) {
      if(err){ return next(err); }

      return res.json(voteRecipes);
    })
  },

  /**
   * @api {get} /recipe/:recipe/downvote List the downvotes for a Recipe
   * @apiName GetDownvotesRecipe
   * @apiGroup Vote Recipe
   *
   * @apiDescription Serve a richiedere la lista di voti negativi di una ricetta.
   * <br>
   * Non sono richiesti ne parametri ne le credenziali dell'utente. 
   *
   * @apiSuccess {json} vote JSON that represents the upvote object.
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
   *      "recipe": "55cc9b54e75edbb10e65089c",
   *      "value": -1,
   *      "createdAt": "2015-09-09T09:53:20.041Z",
   *      "updatedAt": "2015-09-09T09:53:20.041Z",
   *      "id": "55f00190b6aecd11065cab85"
   *    }
   *  ]
   *
   * @apiUse NoRecipeError
   */
  findDownvotes: function (req, res, next) {
    VoteRecipe.find().where({ recipe: req.recipe.id, value: -1 }).populate('author').exec( function (err, voteRecipes) {
      if(err){ return next(err); }

      return res.json(voteRecipes);
    })
  },

  /**
   * @api {get} /recipe/:recipe/vote Check if you voted a Recipe
   * @apiName CheckVoteRecipe
   * @apiGroup Vote Recipe
   *
   * @apiDescription Serve a controllare se l'utente ha votato una ricetta.
   * <br>
   * Necessita di autenticazione.
   *
   * @apiUse TokenHeader
   *
   * @apiSuccess {json} recipe JSON that represents the upvote object.
   *
   * @apiSuccessExample {json} Success-Response-Example:
   *     HTTP/1.1 200 OK
   *  {
   *    value: 1
   *    author: "55b275aa3e4935bc028d02c0"
   *    recipe: "55cc9b54e75edbb10e65089c"
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
   * @apiUse NoRecipeError
   */
  checkVote: function (req, res, next) {
    var user = req.payload;

    VoteRecipe.find().where({ recipe: req.recipe.id, author: user.id }).exec( function (err, voteRecipes) {
      if(err){ return next(err); }

      if(voteRecipes.length == 0) {
        return res.status(404).send('Not found');// HTTP status 404: NotFound
      } else { return res.json(voteRecipes[0]); }
    })
  }
	
};

