/**
 * IngredientController
 *
 * @description :: Server-side logic for managing Ingredients
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
       * @apiDefine NoIngredientError
     *
       * @apiError NoIngredient The ingredient was not found.
       *
       * @apiErrorExample Error-Response:
       *     HTTP/1.1 404 Not Found
       *     {
       *       "error": "No ingredient found"
       *     }
       */

    /**
    * @api {post} /recipe/:recipe/ingredient_group/:ingredient_group/ingredient Create an ingredient
    * @apiName CreateIngredient
    * @apiGroup Recipe
    *
    * @apiDescription Serve per completare la creazione di una ricetta, in particolare 
    * si usa per creare un ingrediente relativo ad un gruppo.<br>
    * <strong>Si deve specificare l'id del prodotto riferito all'ingrediente.</strong><br>
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
    *     quantity=1&unitOfMeasure=cup&product=55ca45e69b4246110b459cf5
    *
    * @apiSuccess {json} recipe JSON that represents the recipe object.
    *
    * @apiSuccessExample {json} Success-Response-Example:
    *     HTTP/1.1 200 OK
    *     {
    *     "ingredient": 
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
    *
    * @apiUse NoIngredientGroupError
    *
    * @apiUse NoProductError
    */
    create: function (req, res, next) {
        var recipe = req.recipe;
        var ingredientGroup = req.ingredientGroup;

        var ingredientToCreate = req.body;
        ingredientToCreate.ingredientGroup = ingredientGroup;

        if (!ingredientToCreate.product) { return next(); }
        
        // controllo che product sia una stringa
        if (!(typeof ingredientToCreate.product === 'string' || myVar instanceof String)) { return next(); }
        
        //find relative Product
        Product.findOne(ingredientToCreate.product).exec(function (err, foundProduct) {
            if (err) { return next(err); }

            if (!foundProduct) { return res.notFound({ error: 'No product found' }); }

            Ingredient.create(ingredientToCreate).exec(function (err, created) {
                if (err) { return next(err); }

                return res.json(created);
            });

        });
    },

	/**
     * @api {put} /recipe/:recipe/ingredient_group/:ingredient_group/ingredient/:ingredient Modify an ingredient
     * @apiName ModifyIngredient
     * @apiGroup Recipe
     *
     * @apiDescription Si usa per modificare un ingrediente relativo ad un gruppo.<br>
     * <strong>Si deve specificare l'id del prodotto riferito all'ingrediente.</strong><br>
     * Visto che ogni ricetta deve avere un autore, soltanto l'autore può
     * eseguire la chiamata.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} recipe Recipe id.
     * @apiParam {String} ingredient_group Ingredient group id.
     * @apiParam {String} ingredient Ingredient id.
     * @apiParam {Object} parameters Pass in body parameters with the same name as the attributes defined on your model to set those values on the desired record.
     *
     * @apiParamExample Request-Body-Example:
     *     quantity=1&unitOfMeasure=cup&product=55ca45e69b4246110b459cf5
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "ingredient": 
     *       {
     *         "createdAt": "2015-08-11T18:58:46.329Z",
     *         "updatedAt": "2015-09-12T18:22:46.329Z",
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
     *
     * @apiUse NoProductError
     *
     * @apiUse NoIngredientError
     */
    update: function (req, res, next) {
        var ingredientGroup = req.ingredientGroup;

        var ingredientId = req.param('ingredient');

        if (!ingredientId) { return next(); }

        var ingredientToUpdate = req.body;
        ingredientToUpdate.ingredientGroup = ingredientGroup;

        if (!ingredientToUpdate.product) { return next(); }
        //find relative Product
        Product.findOne(ingredientToUpdate.product).exec(function (err, foundProduct) {
            if (err) { return next(err); }

            if (!foundProduct) { return res.notFound({ error: 'No product found' }); }

            Ingredient.update({ id: ingredientId, ingredientGroup: ingredientGroup.id }, ingredientToUpdate).exec(function (err, updated) {
                if (err) { return next(err); }

                if (updated.length == 0) { return res.notFound({ error: 'No ingredient found' }); }

                return res.json(updated);
            });

        });
    },

	/**
     * @api {delete} /recipe/:recipe/ingredient_group/:ingredient_group/ingredient/:ingredient Delete an ingredient
     * @apiName DeleteIngredient
     * @apiGroup Recipe
     *
     * @apiDescription Si usa per eliminare un ingrediente relativo ad un gruppo.<br>
     * Visto che ogni ricetta deve avere un autore, soltanto l'autore può
     * eseguire la chiamata.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} recipe Recipe id.
     * @apiParam {String} ingredient_group Ingredient group id.
     * @apiParam {String} ingredient Ingredient id.
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
     *
     * @apiUse NoProductError
     *
     * @apiUse NoIngredientError
     */
    delete: function (req, res, next) {
        var ingredientGroup = req.ingredientGroup;

        var ingredientId = req.param('ingredient');

        if (!ingredientId) { return next(); }

        Ingredient.destroy({ id: ingredientId, ingredientGroup: ingredientGroup.id }).exec(function (err) {
            if (err) { return next(err); }

            return res.send(204, null);// OK - No Content
        });
    },
      
    /**
    * @api {get} /ingredient/unit_of_measures Get ingredient unit of measures
    * @apiName GetIngredientUnitOfMeasure
    * @apiGroup Ingredient
    *
    * @apiDescription Serve per ottenere la lista dei vari tipi di 
    * unità di misura della quantità degli ingredienti.
    * 
    * @apiSuccess {json} recipe JSON that represents the ingredient unit of measures object.
    *
    * @apiSuccessExample {json} Success-Response-Example:
    *     HTTP/1.1 200 OK
    *     {
    *      "type": "string",
    *      "enum": [
    *          "kg",
    *          "hg",
    *          "dg",
    *          "g",
    *          "mg",
    *          "l",
    *          "dl",
    *          "cl",
    *          "ml",
    *          "drop",
    *          "pinch",
    *          "teaspoon",
    *          "tablespoon",
    *          "cup"
    *      ]
    *    }
    *
    */
    getIngredientUnitOfMeasure: function (req, res) {
        return res.json(sails.models.ingredient.definition.unitOfMeasure);
    },

    /**
    * @api {get} /ingredient_group/:id/ingredients Get ingredients list of a group
    * @apiName GetIngredientListForGroup
    * @apiGroup Ingredient
    *
    * @apiDescription Serve per ottenere la lista ingredienti di un gruppo
    * con i relativi valori nutrizionali.
    * 
    * @apiSuccess [{json}] ingredients_list list of JSON that represents each ingredient of the group.
    *
    */
    getIngredientsGroupIngredients: function (req, res, next) {
        var groupId = req.param('id');
        if (!groupId) { return next(); }

        IngredientGroup.findOne(groupId)
            .populate('ingredients')
            .exec(function (err, foundGroup) {
                if (err) { return next(err); }

                if (!foundGroup) { return res.notFound({ error: 'No ingredient group found' }); }

                // Array con id di ricette
                var ingredientIds = new Array();

                for (var i in foundGroup.ingredients) {
                    if (foundGroup.ingredients[i].id)// if exist
                        ingredientIds.push(foundGroup.ingredients[i].id)
                }

                Ingredient.find()
                    .where({ id: ingredientIds })
                    .limit(actionUtil.parseLimit(req))
                    .skip(actionUtil.parseSkip(req))
                    .sort(actionUtil.parseSort(req))
                    .populate('product')
                    .exec(function (err, foundIngredients) {
                        if (err) { return next(err); }

                        return res.json(foundIngredients);
                    });
            });
    }

};

