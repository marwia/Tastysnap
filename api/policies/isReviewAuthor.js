/**
 * isReviewAuthor.js
 *
 * Questa è una politica che si occupa di verificare se l'utente che vuole eseguire
 * una update o delete su una risorsa è il suo autore.
 *
 *
 * @description :: Policy to check if user is authorized to update/delete a review.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

/**
* @apiDefine NoPermissionError
*
* @apiError NoPermission You are not the author of this resource, you can not update/delete it.
*
* @apiErrorExample Error-Response:
*     HTTP/1.1 401 Bad Request
*     {
*       "error": "NoPermission"
*     }
*/

module.exports = function(req, res, next) {
    var user = req.payload;

    var id = req.param('review');
    if (!id) { return badRequest(); }

    ReviewRecipe.findOne(id)
        .exec(function(err, originalReview) {
            if (err) { return next(err); }
            
            if (!originalReview) { return res.notFound({error: 'No review found'})}

            // verifico che l'utente è il creatore della risorsa
            if (originalReview[0].user == user.id) {
                // per sicurezza elimino l'author 
                delete req.body.user;// cancello elementi inopportuni
                next();
            } else
                return res.json(401, { error: 'NoPermission' });
        });

    //next();

};