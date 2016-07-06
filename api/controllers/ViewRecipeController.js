/**
 * ViewRecipeController
 *
 * @description :: Server-side logic for managing Viewrecipes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Permette di comunicare che una ricetta è stat vista dall'utente.
     */
    create: function (req, res, next) {
        var user = req.payload;

        // completo l'oggetto viewRecipe
        var viewRecipe = { user: user.id, recipe: req.recipe.id };

        ViewRecipe.create(viewRecipe).exec(function (err, viewRecipeCreated) {
            if (err) { return next(err); }

            return res.json(201, viewRecipeCreated);
        });
    }

};

