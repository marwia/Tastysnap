/**
 * IngredientGroupController
 *
 * @description :: Server-side logic for managing Ingredientgroups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
     * @api {post} /recipe/:recipe/ingredient_group Create an ingredient group for a Recipe
     * @apiName CreateIngredientGroup
     * @apiGroup Recipe
     *
     * @apiDescription Serve per completare la creazione di una ricetta, in particolare 
     * si usa per creare un gruppo di ingredienti relativo ad essa. 
     * Visto che ogni ricetta deve avere un autore, soltanto l'autore può
     * eseguire la chiamata.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} recipe Recipe id.
     * @apiParam {Object} parameters Pass in body parameters with the same name as the attributes defined on your model to set those values on the desired record.
     *
     * @apiParamExample Request-Body-Example:
     *     name=Sugo
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "ingredientGroup": 
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
     *
     * @apiUse NoRecipeError
     */
	create: function (req, res, next) {
		var recipe = req.recipe;
		var ingredientGroup = req.body;
		ingredientGroup.recipe = recipe;
        ingredientGroup.ingredients = null;
        
		IngredientGroup.create(ingredientGroup).exec(function (err, created){
      		if(err){ return next(err); }

      		return res.json(created);
		});
	},

	/**
     * @api {put} /recipe/:recipe/ingredient_group/:ingredient_group Modify an ingredient group
     * @apiName ModifyIngredientGroup
     * @apiGroup Recipe
     *
     * @apiDescription Serve per modificare una ricetta, in particolare 
     * si usa per modificare un gruppo di ingredienti relativo ad essa. 
     * Visto che ogni ricetta deve avere un autore, soltanto l'autore può
     * eseguire la chiamata.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} recipe Recipe id.
     * @apiParam {String} ingredient_group Ingredient group id.
     * @apiParam {Object} parameters Pass in body parameters with the same name as the attributes defined on your model to set those values on the desired record.
     *
     * @apiParamExample Request-Body-Example:
     *     name=Impasto
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "ingredientGroup": 
     *       {
     *         "createdAt": "2015-08-11T18:58:46.329Z",
     *         "updatedAt": "2015-08-11T19:38:40.329Z",
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
     *
     * @apiUse NoRecipeError
     *
     * @apiUse NoIngredientGroupError
     */
	update: function (req, res, next) {
		var recipe = req.recipe;
		var ingredientGroupId = req.param('ingredient_group');

		if (!ingredientGroupId) { return next(); }

		var newGroup = {name: req.body.name}

		IngredientGroup.update({ id: ingredientGroupId, recipe: recipe.id }, newGroup)
			.exec(function (err, updatedGroups){
      			if(err){ return next(err); }

      			if(updatedGroups.length == 0) { return res.notFound({error: 'No ingredient group found'}); }

      			return res.json(updatedGroups[0]);
		});
	},

	/**
     * @api {delete} /recipe/:recipe/ingredient_group/:ingredient_group Delete an ingredient group
     * @apiName DeleteIngredientGroup
     * @apiGroup Recipe
     *
     * @apiDescription Si usa per modificare un gruppo di ingredienti relativo ad una ricetta. 
     * Visto che ogni ricetta deve avere un autore, soltanto l'autore può
     * eseguire la chiamata.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} recipe Recipe id.
     * @apiParam {String} ingredient_group Ingredient group id.
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
     *
     * @apiUse NoIngredientGroupError
     */
	delete: function (req, res, next) {
		var recipe = req.recipe;
		var ingredientGroupId = req.param('ingredient_group');

		if (!ingredientGroupId) { return next(); }

		IngredientGroup.destroy({ id: ingredientGroupId, recipe: recipe.id })
			.exec(function (err){
				if(err){ return next(err); }

				return res.send(204, null);// OK - No Content
		});
	}
	
};

