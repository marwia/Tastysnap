/**
 * findComment.js
 *
 * Questa è una politica che si occupa di verificare se l'utente ha inserito
 * il riferimento ad un commento e se questo commento esiste.
 * Se esiste allora viene aggiunto nella chiamata per poter
 * proseguire con altre operazioni.
 *
 * @description :: Policy to check if a comment exists.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

 /**
 * @apiDefine NoCommentError
 *
 * @apiError NoComment The comment was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No comment found"
 *     }
 */
module.exports = function (req, res, next) {
  	var commentId = req.param('comment');// l'id è un parametro
    
    if (!commentId) { return next(); }

    Comment.findOne(commentId).exec(function (err, comment) {
      if(err){ return next(err); }

      if(!comment) { return res.notFound({error: 'No comment found'}); }

      req.comment = comment;// aggiungo la ricetta alla richiesta
      next();// prosegui
    });

};