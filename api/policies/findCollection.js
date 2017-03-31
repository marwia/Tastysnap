/**
 * findCollection.js
 *
 * Questa è una politica che si occupa di verificare se l'utente ha inserito
 * il riferimento ad una collezione di ricette e se questa collezione esiste.
 * Se questa esiste allora viene aggiunta nella chiamata per poter
 * proseguire con altre operazioni.
 *
 * @description :: Policy to check if a collection exists.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

 /**
 * @apiDefine NoCollectionError
 *
 * @apiError NoCollection The collection was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No collection found"
 *     }
 */
module.exports = function (req, res, next) {
  	var collectionId = req.param('collection');// l'id è un parametro
    
    if (!collectionId) { return next(); }

    Collection.findOne(collectionId).exec(function (err, collection) {
      if(err){ return next(err); }

      if(!collection) { return res.notFound({error: 'No collection found'}); }

      req.collection = collection;// aggiungo la raccolta alla richiesta
      next();// prosegui
    });

};