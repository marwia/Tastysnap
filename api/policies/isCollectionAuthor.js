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

    // caso alternativo se il parametro dell'id ha un nome diverso
    if (req.param('id'))
        collectionId = req.param('id');

    if (!collectionId) { return res.badRequest(); }

    Collection.findOne(collectionId)
        .exec(function(err, originalCollection) {
            if (err) { return next(err); }

            if (!originalCollection) { return res.notFound({error: 'No collection found'}); }
            
            // verifico che l'utente è il creatore della risorsa
            if (originalCollection.author == user.id) {
                // per sicurezza elimino l'author 
                delete req.body.user;// cancello elementi inopportuni
                req.collection = originalCollection;
                next();

            // altrimenti verifico se l'utente possiede permessi d'amministratore   
            } else {
                UserPermission
                    .findOne({ email: user.email, type: 'admin' })
                    .exec(function (err, foundUser) {
                        if (err) { return next(err); }

                        if (!foundUser) { return res.json(401, { error: 'NoPermission' }); }

                        next();
                    });
            }
        });

};