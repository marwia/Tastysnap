/**
 * findIngredientGroup.js
 *
 * Questa è una politica che si occupa di verificare se l'utente ha inserito
 * il riferimento ad una gruppo di ingredienti e se questo gruppo esiste.
 * Se questo esiste allora viene aggiunto nella chiamata per poter
 * proseguire con altre operazioni.
 *
 * @description :: Policy to check if a ingredient group exists.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

 /**
 * @apiDefine NoIngredientGroupError
 *
 * @apiError NoIngredientGroup The ingredient group was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No ingredient group found"
 *     }
 */
module.exports = function (req, res, next) {
  	var ingredientGroupId = req.param('ingredient_group');// l'id è un parametro
    
    if (!ingredientGroupId) { return next(); }

    IngredientGroup.find( {id: ingredientGroupId, recipe: req.recipe.id} ).exec(function (err, ingredientGroups) {
      if(err){ return next(err); }

      if(ingredientGroups.length==0) { return res.notFound({error: 'No ingredient group found'}); }

      req.ingredientGroup = ingredientGroups[0];// aggiungo la ricetta alla richiesta
      next();// prosegui
    });

};