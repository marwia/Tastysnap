/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * @api {post} /recipe
     * @apiName CreateRecipe
     * @apiGroup Recipe
     *
     * @apiDescription Serve per caricare un ricetta creata da un utente.
     *
     * @apiParam {Object} recipe Recipe to upload.
     * @apiHeader {String} token  Authentication token.
     *
     * @apiHeaderExample {json} Request-Example:
     *     Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNhdmFsbG8iLCJjcmVhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJ1cGRhdGVkQXQiOiIyMDE1LTA3LTI0VDE3OjI4OjEwLjU3N1oiLCJpZCI6IjU1YjI3NWFhM2U0OTM1YmMwMjhkMDJjMCIsImlhdCI6MTQzOTA1ODQ2MSwiZXhwIjoxNDM5MDY5MjYxfQ.EBvGiq4fuRwKXjgrX5kKmUJZVQOgkjCBRe-j--g8NbU
     *
     * @apiSuccess {Object} recipe Recipe object.
     *
     * @apiSuccessExample Success-Response:
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
     * @apiError BadRequest Mancano dei parametri all'oggetto inviato al server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "message": "Please fill out all fields"
     *     }
     */
    // Esempio di redefinizione della classica azione di create
    create: function (req, res, next) {
      var user = req.payload;
      console.log(user);

      var recipe = req.body;
      console.log(recipe);

      recipe.author = user;

      Recipe.create(recipe).exec(function(err, recipe){
        if(err){ return next(err); }
        console.log(recipe);
        return res.json(recipe);
      });
    }
	
};

