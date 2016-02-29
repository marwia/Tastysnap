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
        var viewRecipe = {user: user, recipe: req.recipe.id };

        //cerco se c'è gia uno stesso vote
        ViewRecipe.find().where({ author: user.id, recipe: req.recipe.id })
            .exec(function (err, viewRecipes) {
                if (err) { return next(err); }
                
                if (viewRecipes.length == 1) {
                    return res.json(200, viewRecipes[0]) 
                } else {
                    ViewRecipe.create(viewRecipe).exec(function (err, viewRecipeCreated) {
                        if (err) { return next(err); }

                        return res.json(201, viewRecipeCreated);
                    });
                }
            });
    }
	
};

