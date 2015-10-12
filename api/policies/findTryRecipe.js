/**
 * findTryRecipe.js
 *
 * Questa è una politica che si occupa di verificare se l'utente ha inserito
 * il riferimento ad una prova di ricetta e se questa prova esiste.
 * Se questa esiste allora viene aggiunta nella chiamata per poter
 * proseguire con altre operazioni.
 *
 * @description :: Policy to check if a collection exists.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

 /**
 * @apiDefine NoTryError
 *
 * @apiError NoTry The try was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No try found"
 *     }
 */
module.exports = function (req, res, next) {
  	var tryId = req.param('try');// l'id è un parametro
    
    if (!tryId) { return next(); }

    TryRecipe.findOne(tryId).exec(function (err, trial) {
      if(err){ return next(err); }

      if(!trial) { return res.notFound({error: 'No try found'}); }

      req.trial = trial;// aggiungo la ricetta alla richiesta
      next();// prosegui
    });

};