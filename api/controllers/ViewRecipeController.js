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
        var viewRecipe = {user: user.id, recipe: req.recipe.id };

        //cerco se c'è gia uno stesso vote
        ViewRecipe.findOne().where(viewRecipe)
            .exec(function (err, view) {
                if (err) { return next(err); }
                
                if (view != null) {
                    ViewRecipe.update(viewRecipe, viewRecipe)
                        .exec(function (err, updated) {
                            if (err) { return next(err); }
                            
                            return res.json(200, updated[0]) 
                        });
                        
                } else {
                    ViewRecipe.create(viewRecipe).exec(function (err, viewRecipeCreated) {
                        if (err) { return next(err); }

                        return res.json(201, viewRecipeCreated);
                    });
                }
            });
    }
	
};

