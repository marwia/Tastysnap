/**
 * findProduct.js
 *
 * Questa è una politica che si occupa di verificare se l'utente ha inserito
 * il riferimento ad un prodotto e se questo prodotto esiste.
 * Se questo esiste allora viene aggiunto nella chiamata per poter
 * proseguire con altre operazioni.
 *
 * @description :: Policy to check if a product exists.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

 /**
 * @apiDefine NoProductError
 *
 * @apiError NoProduct The recipe was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No product found"
 *     }
 */
module.exports = function (req, res, next) {
  	var recipeId = req.param('recipe');// l'id è un parametro
    
    if (!recipeId) { return next(); }

    Recipe.findOne(recipeId).exec(function (err, recipe) {
      if(err){ return next(err); }

      if(!recipe) { return res.notFound({error: 'No recipe found'}); }

      req.recipe = recipe;// aggiungo la ricetta alla richiesta
      next();// prosegui
    });

};