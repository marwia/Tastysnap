/**
 * setRecipeViewed.js
 *
 * Questa è una politica che serve a settare che un'utente ha visualizzato
 * una ricetta.
 *
 * ATTENZIONE: Nelle query (find, findOne, update(qui, ...)) bisogna
 * specificare le referenze dell'oggetto da cercare tramite id,
 * invece quando si crea si può inserire direttamente l'oggetto referenziato.
 *
 *
 * @description :: Policy to set that user has viewed a recipe
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */


module.exports = function (req, res, next) {
  var user = req.payload;

  var recipeId = req.param('id');

  if (recipeId && user)// se non ho i dati necessari allora non proseguo
    // verifico se esiste la ricetta richiesta
    Recipe.findOne(recipeId).exec(function (err, foundedRecipe) {
      if(err){ console.log(err); }
      else {
        // creo l'oggetto che rappresenta la visualizzazione
        var viewRecipe = {user: user, recipe: foundedRecipe};
        ViewRecipe.create(viewRecipe).exec(function (err, created){
          if(err){ console.log(err); }
        });
      }
    });

  next();// intanto il server prosegue...
};