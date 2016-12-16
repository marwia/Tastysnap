/**
 * StaticController
 *
 * @description :: Server-side logic for managing Statics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    recipe: function (req, res, next) {
        var recipeId = req.param('recipe');
        if (!recipeId) { return next(); }

        Recipe.findOne(recipeId)
            .populate('steps')
            .exec(function (err, foundRecipe) {
                if (err) { return next(err); }

                if (!foundRecipe) { return res.notFound({ error: 'No recipe found' }); }

                return res.view('static',
                        {
                            title: foundRecipe.title, 
                            description: foundRecipe.steps[0].description,
                            imageUrl: foundRecipe.coverImageUrl,
                            url: 'https://www.tastysnap/static/app/recipe/' + foundRecipe.id,
                            layout: false
                        });
            });
    }
	
};

