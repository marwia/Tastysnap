/**
 * RecipeController
 *
 * @description :: Server-side logic for managing Recipes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * @api {get} /recipe List Recipes
     * @apiName ListRecipes
     * @apiGroup Recipe
     *
     * @apiDescription Serve per richiedere un lista di ricette.
     * Attenzione che i risultati sono limitati ad un numero preciso di ricette, massimo 30 per richiesta.<br>
     * Questo end point accetta prametri.
     *
     * @apiParam {Integer} skip The number of records to skip (useful for pagination).
     * @apiParam {Integer} limit The maximum number of records to send back (useful for pagination). Defaults to 30. 
     * @apiParam {String} where Instead of filtering based on a specific attribute, you may instead choose to provide a where parameter with a Waterline WHERE criteria object, encoded as a JSON string.
     * @apiParam {String} sort The sort order. By default, returned records are sorted by primary key value in ascending order. 
     *
     * @apiParamExample Request-Param-Example:
     *     ?skip=6&limit=3
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     [
     *{
     *  "votes": [],
     *  "comments": [],
     *  "collections": [],
     *  "author": {
     *    "username": "cavallo",
     *    "createdAt": "2015-07-24T17:28:10.577Z",
     *    "updatedAt": "2015-07-24T17:28:10.577Z",
     *    "id": "55b275aa3e4935bc028d02c0"
     *  },
     *  "Title": "Carbonara new",
     *  "Description": "dedsds sd sdsd",
     *  "upvotes": 0,
     *  "createdAt": "2015-08-13T13:31:25.262Z",
     *  "updatedAt": "2015-08-13T13:31:25.262Z",
     *   "id": "55cc9c2de75edbb10e6508a1"
     * },
     * {
     *  "votes": [],
     *   "comments": [],
     *  "collections": [],
     *  "author": {
     *    "username": "cavallo",
     *   "createdAt": "2015-07-24T17:28:10.577Z",
     *    "updatedAt": "2015-07-24T17:28:10.577Z",
     *    "id": "55b275aa3e4935bc028d02c0"
     *  },
     *  "Title": "Carbonara",
     *  "Description": "dedsds sd sdsd",
     *  "upvotes": 0,
     *  "createdAt": "2015-08-13T14:05:26.104Z",
     *  "updatedAt": "2015-08-13T14:05:26.104Z",
     *  "id": "55cca42654ceca27112f4733"
     *},
     *{
     *  "votes": [],
     *  "comments": [],
     *  "collections": [],
     *  "author": {
     *    "username": "cavallo",
     *    "createdAt": "2015-07-24T17:28:10.577Z",
     *    "updatedAt": "2015-07-24T17:28:10.577Z",
     *    "id": "55b275aa3e4935bc028d02c0"
     *  },
     *  "Title": "Carbonara 2",
     *  "Description": "dedsds sd sdsd",
     *  "upvotes": 0,
     *  "createdAt": "2015-08-13T14:06:59.150Z",
     *  "updatedAt": "2015-08-13T14:06:59.150Z",
     *  "id": "55cca48354ceca27112f4734"
     *}
     *]
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */

     /**
     * @api {get} /recipe/:id Get a Recipe
     * @apiName GetRecipe
     * @apiGroup Recipe
     *
     * @apiDescription Serve per caricare tutti i dettagli di una ricetta.
     *
     * @apiParam {String} id Recipe id.
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "recipe": 
     *       {
     *         "createdAt": "2015-08-11T18:58:46.329Z",
     *         "updatedAt": "2015-08-11T18:58:46.329Z",
     *         "id": "55ca45e69b4246110b319cb1"
     *       }
     *     }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     */

    /**
     * @api {post} /recipe Create a new Recipe
     * @apiName CreateRecipe
     * @apiGroup Recipe
     *
     * @apiDescription Serve per caricare un ricetta creata da un utente.
     * Visto che ogni ricetta deve avere un autore, si deve inviare qualsiasi
     * ricetta con il token del suo autore.<br>
     * Una volta creata la ricetta, il client deve proseguire creando prima i 
     * gruppi di ingredienti e poi gli ingredienti di ogni gruppo. Una volta finita
     * questa serie di creazioni, la ricetta può essere considerata creata con successo.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample Request-Header-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiParam {String} title Recipe title.
     * @apiParam {String} description Recipe description.
     *
     * @apiParam {json} recipe JSON string that represents the Recipe.
     *
     * @apiParamExample Request-Body-Example:
     *     title=Spaghetti+fantastici&description=Questa+ricetta...
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "recipe": 
     *       {
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

      var recipe = req.body;
      // setto l'autore della ricetta
      recipe.author = user;

      Recipe.create(recipe).exec(function(err, recipe){
        if(err){ return next(err); }
        return res.json(recipe);
      });
    },

    /**
     * @api {delete} /recipe Delete a Recipe
     * @apiName DeleteRecipe
     * @apiGroup Recipe
     *
     * @apiDescription Serve per eliminare un ricetta creata da un utente.
     * Si deve inviare qualsiasi richiesta con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample Request-Header-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "recipe": 
     *       {
     *         "title": "Spagoasd"
     *         "description": "..."
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
     *
     * @apiUse NoPermissionError
     */

    /**
     * @api {put} /recipe/:id Update a Recipe
     * @apiName UpdateRecipe
     * @apiGroup Recipe
     *
     * @apiDescription Serve per applicare delle modifiche ad un ricetta.
     * Visto che ogni ricetta deve avere un autore, soltanto l'autore può
     * eseguire l'update.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} id Recipe id.
     * @apiParam {Object} parameters Pass in body parameters with the same name as the attributes defined on your model to set those values on the desired record.
     *
     * @apiParamExample Request-Body-Example:
     *     title=Spaghetti+fantastici&description=Questa+ricetta...
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "recipe": 
     *       {
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
     *
     * @apiUse NoPermissionError
     */
	
};

