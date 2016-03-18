/**
 * findRecipe.js
 *
 * Questa è una politica che si occupa di verificare se l'utente ha inserito
 * il riferimento ad una ricetta e se questa ricetta esiste.
 * Se questa esiste allora viene aggiunta nella chiamata per poter
 * proseguire con altre operazioni.
 *
 * @description :: Policy to check if a recipe exists.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

/**
* @apiDefine NoRecipeError
*
* @apiError NoRecipe The recipe was not found.
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*     {
*       "error": "No recipe found"
*     }
*/
module.exports = function(req, res, next) {
    var recipeId = req.param('recipe');// l'id è un parametro

    if (!recipeId) { return next(); }

    Recipe
        .findOne(recipeId)
        .exec(function(err, recipe) {
        if (err) { return next(err); }

        if (!recipe) { return res.notFound({ error: 'No recipe found' }); }

        req.recipe = recipe;// aggiungo la ricetta alla richiesta
        next();// prosegui
    });

};