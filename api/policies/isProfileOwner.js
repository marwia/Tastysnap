/**
 * isProfileOwner.js
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

    var userId = req.param('user');// l'id è un parametro

    // caso alternativo se il parametro dell'id ha un nome diverso
    if (req.param('id'))
        userId = req.param('id');

    if (!userId) { return res.badRequest(); }

    if (userId == user.id)
        next();
    else
        return res.forbidden('Access denied.');

};