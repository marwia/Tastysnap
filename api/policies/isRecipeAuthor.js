/**
 * isRecipeAuthor.js
 *
 * Questa è una politica che si occupa di verificare se l'utente che vuole eseguire
 * una update su una risorsa è il suo autore.
 *
 * ATTENZIONE: si deve implementarla per ogni Model che si ritiene opportuno.
 *
 * @description :: Policy to check if user is authorized to update a resource.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  var user = req.payload;

  var id = req.param('id');

  // caso alternativo se il parametro dell'id ha un nome diverso
  if(req.param('recipe'))
    id = req.param('recipe');

  Recipe.find(id).limit(1)
    .exec(function (err, originalRecipe) {
      if(err){ return next(err); }

      if(originalRecipe.length==0) { return res.notFound({error: 'No recipe found'}); }

      // verifico che l'utente è il creatore della risorsa
      if(originalRecipe[0].author == user.id) {
        // per sicurezza elimino l'author 
        delete req.body.author;// cancello elementi inopportuni
        req.recipe = originalRecipe[0];
        next();
      } else
        return res.json(401, {error: 'NoPermission'});
  });

};