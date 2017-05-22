/**
 * RecipeService
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

    /**
     * Funzione per filtrare le ricette da validare oppure non valide,
     * ovvero per toglierle dalla risposta se l'utente non risulta 
     * essere autorizzato a vederle.
     * Se nei criteri di ricerca c'è il parametro 'includeAll'
     * allora vengono incluse tutte le ricette a priscindere dal
     * loro stato (questo viene usato dalla redazione).
     */
    filterRecipe: function (req, recipe, originalCriteria) {

        if (originalCriteria.includeAll && originalCriteria.includeAll == true) {
            return recipe;
        }

        /**
         * Se la ricetta non è valida, allora non la faccio vedere
         */
        if (recipe && recipe.ingredientState == "notValid") {
            return null;
        }

        // se la ricetta è da validare controllo se l'utente che ha
        // effettuato la richiesta è l'autore della ricetta
        if (recipe && recipe.ingredientState == "toBeValidate") {
            // riprendo l'utente dalla policy "attachUser"
            var user = req.payload;
            /**
             * se l'utente non è autenticato oppure non è l'autore allora 
             * non può vedere la ricetta
             * 
             * Attenzione: recipe.author non è di tipo String ma string
             */
            if (!user || 
                (recipe.author.id != undefined && recipe.author.id != user.id) || 
                (!(recipe.author instanceof Object) && recipe.author != user.id))
                return null;
        }

        return recipe;
    },

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