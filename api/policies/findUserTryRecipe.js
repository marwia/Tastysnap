/**
 * findUserTryRecipe.js
 *
 * Questa è una politica che si occupa di trovare una prova dell'utente autenticato 
 * riferita ad una ricetta.
 * Se questa esiste allora viene aggiunta nella chiamata per poter
 * proseguire con altre operazioni.
 *
 * @description :: Policy to check if user has a trial for a recipe.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  	var recipeId = req.param('recipe');// l'id è un parametro
    var user = req.user;
    
    if (!recipeId) { return next(); }

    TryRecipe.find().where({ recipe: recipeId, user: user.id}).exec(function (err, trial) {
      if(err){ return next(err); }

      if(!trial) { return res.notFound({error: 'No try found'}); }

      req.userTrial = trial;// aggiungo la ricetta alla richiesta
      next();// prosegui
    });

};