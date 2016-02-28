/**
 * TryRecipeController
 *
 * @description :: Server-side logic for managing Tryrecipes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/**
	* @api {post} /recipe/:recipe/try Try a Recipe
	* @apiName CreateTryRecipe
	* @apiGroup Try Recipe
	*
	* @apiDescription Serve per dire che una ricetta è stata assaggiata.
	* Visto che ogni prova deve avere un autore, si deve inviare qualsiasi
	* richiesta con il token del suo autore.<br>
	* Non sono richiesti parametri. 
	*
	* @apiUse TokenHeader
	*
	* @apiSuccess {json} try JSON that represents the try object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*     {
	*        "author": "55b275aa3e4935bc028d02c0",
	*        "recipe": "55cc9b54e75edbb10e65089c",
	*        "createdAt": "2015-09-09T09:53:20.041Z",
	*        "updatedAt": "2015-09-09T09:53:20.041Z",
	*        "id": "55f00190b6aecd11065cab85"
	*     }
	*
	* @apiUse TokenFormatError
	*
	* @apiUse NoAuthHeaderError
	*
	* @apiUse InvalidTokenError
	*/
    create: function (req, res, next) {
        var user = req.payload;
	
        // completo l'oggetto voteRecipe
        var tryRecipe = { user: user, recipe: req.recipe.id };
	
        //cerco se c'è gia uno stesso vote
        TryRecipe.find().where({ user: user.id, recipe: req.recipe.id })
            .exec(function (err, tryRecipes) {
                if (err) { return next(err); }

                if (tryRecipes.length == 0) {// non trovato, quindi ne posso creare uno
                    TryRecipe.create(tryRecipe).exec(function (err, tryRecipeCreated) {
                        if (err) { return next(err); }

                        return res.json(tryRecipeCreated);
                    });
                } else { return res.json(tryRecipes[0]); }
            });
    },
		
	/**
	* @api {delete} /recipe/:recipe/try Delete a try related to a Recipe
	* @apiName DeleteTryRecipe
	* @apiGroup Try Recipe
	*
	* @apiDescription Serve eliminare una prova relativa ad una ricetta.
	* Visto che ogni prova deve avere un autore, si deve inviare qualsiasi
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
	* @apiUse NoRecipeError
	*/
    destroy: function (req, res, next) {
        var user = req.payload;

        var tryRecipeToDelete = { user: user.id, recipe: req.recipe.id };

        TryRecipe.destroy(tryRecipeToDelete).exec(function (err) {
            if (err) { return next(err); }

            return res.send(204, null);// eliminato
        })
    },
		
	/**
	* @api {get} /recipe/:recipe/try List the trials for a Recipe
	* @apiName GetTrialsRecipe
	* @apiGroup Try Recipe
	*
	* @apiDescription Serve a richiedere la lista di prove relative a una ricetta.
	* <br>
	* Non sono richiesti ne parametri ne le credenziali dell'utente. 
	*
	* @apiSuccess {json} trials JSON that represents the trials list object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*  [
	*    {
	*      "user": {
	*        "username": "cavallo",
	*        "createdAt": "2015-07-24T17:28:10.577Z",
	*        "updatedAt": "2015-07-24T17:28:10.577Z",
	*        "id": "55b275aa3e4935bc028d02c0"
	*    },
	*      "recipe": "55cc9b54e75edbb10e65089c",
	*      "createdAt": "2015-09-09T09:53:20.041Z",
	*      "updatedAt": "2015-09-09T09:53:20.041Z",
	*      "id": "55f00190b6aecd11065cab85"
	*    }
	*  ]
	*
	* @apiUse NoRecipeError
	*/
    find: function (req, res, next) {
        TryRecipe.find().where({ recipe: req.recipe.id })
            .populate('user').populate('details')
            .exec(function (err, tryRecipes) {

                if (err) { return next(err); }

                return res.json(tryRecipes);
            })
    },

	/**
	* @api {get} /recipe/:recipe/tried Check if you tried a Recipe
	* @apiName CheckTryRecipe
	* @apiGroup Try Recipe
	*
	* @apiDescription Serve a controllare se l'utente ha provato una ricetta.
	* <br>
	* Necessita di autenticazione.
	*
	* @apiUse TokenHeader
	*
	* @apiSuccess {json} try JSON that represents the try object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*   HTTP/1.1 200 OK 
	*  	{
	*    	author: "55b275aa3e4935bc028d02c0"
	*    	recipe: "55cc9b54e75edbb10e65089c"
	*  		createdAt: "2015-09-09T19:53:12.315Z"
	*  		updatedAt: "2015-09-09T19:53:12.315Z"
	*    	id: "55f08e28a489ce62116cfacf"
	*  	}
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
    checkTry: function (req, res, next) {
        var user = req.payload;

        TryRecipe.find().where({ recipe: req.recipe.id, user: user.id }).populate('details').exec(function (err, tryRecipes) {
            if (err) { return next(err); }

            if (tryRecipes.length == 0) {
                return res.status(404).send('Not found');// HTTP status 404: NotFound
            } else { return res.json(tryRecipes[0]); }
        });
    }
};

