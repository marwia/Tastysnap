/**
 * CollectionRecipeController
 *
 * @description :: Server-side logic for managing collections' recipes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * @api {get} /collection/:collection/recipe List recipes for a Collection
     * @apiName ListRecipeForCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per richiedere la lista di ricette che sono in un collezione.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *
     */
    getRecipes: function(req, res, next) {
        var collection = req.collection;

        CollectionRecipe.find({
            collection: collection.id
        }).exec(function (err, foundCollectionRecipes) {
            if (err) { return next(err); }

            // Array con id di ricette
            var recipeIds = new Array();

            for (var i in foundCollectionRecipes) {
                if (foundCollectionRecipes[i].recipe)// if exist
                    recipeIds.push(foundCollectionRecipes[i].recipe)
            }

            // find recipes
            RecipeService.find(req, res, next, recipeIds);
        });

    },

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
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} recipe JSON that represents the updated collection object.
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
     */
    create: function(req, res, next) {
        var collection = req.collection;
        var recipeId = req.body.recipe_id;
        if (!recipeId) { return next(); }

        CollectionRecipe.findOne({
            collection: collection.id,
            recipe: recipeId
        }).exec( function (err, foundCollectionRecipe) {
            if (err) { return next(err); }

            if (foundCollectionRecipe) return res.badRequest();

            CollectionRecipe.create({
                collection: collection.id,
                recipe: recipeId
            }).exec( function (err, createdCollectionRecipe) {
                if (err) { return next(err); }
                return res.send(204, null);// OK - No Content
            });
        });

    },

    /**
     * @api {delete} /collection/:collection/recipe Remove a recipe from a Collection
     * @apiName RemoveRecipeCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per rimuovere una ricetta da un propria collezione.
     * Per essere sicuri dell'eliminazione conviene richiedere la stessa collezione.
     * Bisogna essere autori della collezione.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiParam {Integer} recipe_id The id of the recipe to remove.
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
     */

    destroy: function (req, res, next) {
        var collection = req.collection;
        var recipeId = req.body.recipe_id;
        if (!recipeId) { return next(); }

        CollectionRecipe.destroy({
            collection: collection.id,
            recipe: recipeId
        }).exec(function (err) {
            if (err) { return next(err); }

            return res.send(204, null);// OK - No Content
        });

    },

};

