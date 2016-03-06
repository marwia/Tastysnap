/**
 * RecipeService
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

    /**
     * Metodo per ritrovare 'n' ricette e popularle in modo standard.
     * Sostanzialmente serve a dare una definizione standard alle
     * liste di ricette.
     */
    find: function (req, res, next, recipeIds) {

        Recipe.find()
            .where({ id: recipeIds })
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('author')
            .populate('views')
            .populate('votes')
            .populate('comments')
            .populate('trials')
            .exec(function (err, foundRecipes) {
                if (err) { return next(err); }
            
                // array di appoggio
                var recipes = new Array();
            
                // conto gli elementi delle collection
                for (var i in foundRecipes) {
                    foundRecipes[i].viewsCount = foundRecipes[i].views.length;
                    foundRecipes[i].votesCount = foundRecipes[i].votes.length;// aggiungere verifica sul value positivo
                    foundRecipes[i].commentsCount = foundRecipes[i].comments.length;
                    foundRecipes[i].trialsCount = foundRecipes[i].trials.length;

                    /**
                     * Tolgo gli elementi popolati, per qualche ragione gli elementi che sono
                     * delle associazioni vengono automaticamente tolte quando si esegue
                     * il seguente metodo.
                     */
                    var obj = foundRecipes[i].toObject();
                    delete obj.description;// tolgo la descrizione della ricetta
                    delete obj.views;
                    delete obj.votes;
                    delete obj.comments;
                    delete obj.trials;
                    recipes.push(obj);
                }
                return res.json(recipes);
            });

    }
};