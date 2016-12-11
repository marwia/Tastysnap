/**
 * isCommentAuthor.js
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

    var id = req.param('id');
    if (!id) { return badRequest(); }

    Comment.findOne(id)
        .exec(function(err, originalComment) {
            if (err) { return next(err); }
            
            if (!originalComment) { return res.notFound({error: 'No comment found'})}

            // verifico che l'utente è il creatore della risorsa
            if (originalComment.user == user.id) {
                // per sicurezza elimino l'author 
                delete req.body.user;// cancello elementi inopportuni
                next();
            } else
                return res.json(401, { error: 'NoPermission' });
        });

};