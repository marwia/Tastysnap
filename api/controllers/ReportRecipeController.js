/**
 * ReportRecipeController
 *
 * @description :: Server-side logic for managing Reportrecipes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/**
	* @api {post} /recipe/:recipe/report Report a Recipe
	* @apiName CreateReportRecipe
	* @apiGroup Report Recipe
	*
	* @apiDescription Serve per dire che una ricetta è stata segnalata.
	* Visto che ogni segnalazione deve avere un autore, si deve inviare qualsiasi
	* richiesta con il token del suo autore.<br>
    *
	* @apiParam {String} string Report optional description.
	*
	* @apiUse TokenHeader
	*
	* @apiSuccess {json} try JSON that represents the report object.
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
        
        var reportRecipe = req.body;
	
        // completo l'oggetto reportRecipe
        reportRecipe.user = user;
        reportRecipe.recipe = req.recipe.id;
	
        ReportRecipe.create(reportRecipe).exec(function (err, reportRecipeCreated) {
            if (err) { return next(err); }

            return res.json(reportRecipeCreated);
        });

    },
		
	/**
	* @api {get} /recipe/:recipe/report List the reports for a Recipe
	* @apiName GetReportsRecipe
	* @apiGroup Report Recipe
	*
	* @apiDescription Serve a richiedere la lista di segnalazioni relative a una ricetta.
	* <br>
	* Nota: soltanto gli utenti con privilegi amministratore possono richiedere 
    * tale risorsa. 
	*
	* @apiSuccess {json} reports JSON that represents the reports list object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*  [
	*    {
	*      "user": {
	*        ... ,
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
        ReportRecipe.find().where({ recipe: req.recipe.id })
            .populate('user')
            .exec(function (err, reportRecipes) {

                if (err) { return next(err); }

                return res.json(reportRecipes);
            })
    }
    
};