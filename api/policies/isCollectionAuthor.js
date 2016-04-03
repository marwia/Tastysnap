/**
 * isCollectionAuthor.js
 *
 * Questa è una politica che si occupa di verificare se l'utente che vuole eseguire
 * una update su una risorsa è il suo autore.
 *
 *
 * @description :: Policy to check if user is authorized to update a comment.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

/**
* @apiDefine NoPermissionError
*
* @apiError NoPermission You are not the author of this resource, you can not update it.
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 401 Bad Request
*     {
*       "error": "NoPermission"
*     }
*/

module.exports = function(req, res, next) {
    var user = req.payload;

    var collectionId = req.param('collection');// l'id è un parametro
    
    if (!collectionId) { return res.badRequest(); }

    Collection.findOne(collectionId)
        .exec(function(err, originalCollection) {
            if (err) { return next(err); }

            if (!originalCollection) { return res.notFound({error: 'No collection found'}); }
            
            // verifico che l'utente è il creatore della risorsa
            if (originalCollection.author == user.id) {
                // per sicurezza elimino l'author 
                delete req.body.user;// cancello elementi inopportuni
                next();
            } else
                return res.json(401, { error: 'NoPermission' });
        });

};