/**
 * CollectionController
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
     * @api {post} /collection Create a new Collection
     * @apiName CreateCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per creare una collezione di ricette.
     * Visto che ogni collezione deve avere un autore, si deve effettuare qualsiasi
     * chiamata con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample Request-Header-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiParam {String} title Collection title.
     * @apiParam {String} description Collection description.
     *
     * @apiParam {json} recipe JSON string that represents the Recipe.
     *
     * @apiParamExample Request-Body-Example:
     *     title=Spaghetti+fantastici&description=Questa+ricetta...
     *
     * @apiSuccess {json} collection JSON that represents the collection object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "collection": 
     *       {
     *		   "title" : "Menu primaverile",
     *         "description" : "Lista di piatti perfetti per un risveglio tutto naturale.",
     *         "createdAt": "2015-08-11T18:58:46.329Z",
     *         "updatedAt": "2015-08-11T18:58:46.329Z",
     *         "id": "55ca45e69b4246110b319cb1"
     *       }
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

      var collection = req.body;
      // setto l'autore della ricetta
      collection.author = user;

      Collection.create(collection).exec(function(err, createdCollection){
        if(err){ return next(err); }
        return res.json(createdCollection);
      });
    },

    /**
     * @api {delete} /collection Delete a Collection
     * @apiName DeleteCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per eliminare una propria collezione.
     * Si deve inviare qualsiasi richiesta con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample Request-Header-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiSuccess {json} recipe JSON that represents the collection object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
		{
		  "recipes": [],
		  "author": {
		    "username": "cavallo",
		    "createdAt": "2015-09-15T13:59:50.559Z",
		    "updatedAt": "2015-09-15T13:59:50.559Z",
		    "id": "55f8245674cb8184028877b9"
		  },
		  "title": "Cazzate",
		  "description": "Bla bla bla...",
		  "createdAt": "2015-09-15T20:33:00.133Z",
		  "updatedAt": "2015-09-15T20:33:00.133Z",
		  "id": "55f8807c10dc1b5d0abda19a"
		}
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoPermissionError
     */

    /**
     * @api {put} /collection/:collection/recipe Add a recipe to a Collection
     * @apiName AddRecipeCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per aggiungere una ricetta ad un propria collezione.
     * Bisogna essere autori della collezione.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiParam {Integer} recipe_id The id of the recipe to add.
     *
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample Request-Header-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiSuccess {json} recipe JSON that represents the collection object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
		{
		  "recipes": [],
		  "author": {
		    "username": "cavallo",
		    "createdAt": "2015-09-15T13:59:50.559Z",
		    "updatedAt": "2015-09-15T13:59:50.559Z",
		    "id": "55f8245674cb8184028877b9"
		  },
		  "title": "Cazzate",
		  "description": "Bla bla bla...",
		  "createdAt": "2015-09-15T20:33:00.133Z",
		  "updatedAt": "2015-09-15T20:33:00.133Z",
		  "id": "55f8807c10dc1b5d0abda19a"
		}
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoPermissionError
     */
    addRecipe: function (req, res, next) {
     	var recipeId = req.body.recipe_id;
     	if(!recipeId) { return next(); }

     	Recipe.findOne(recipeId).exec(function (err, recipe) {
      		if(err){ return next(err); }

      		if(!recipe) { return res.notFound({error: 'No recipe found'}); }

		    var newCollection = req.collection;
		    newCollection.recipes.add(recipe);
		    console.log(newCollection);

		    Collection.update({id: newCollection.id}, newCollection).exec(function (err, updatedCollections){
      			if(err){ return next(err); }

      			return res.json(updatedCollections[0]);
    		});
    	});
	    
    },
	
};

