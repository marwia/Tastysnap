/**
 * findUser.js
 *
 * Questa è una politica che si occupa di verificare se l'utente ha inserito
 * il riferimento ad un altro utente e se questo esiste.
 * Se questo esiste allora viene aggiunta nella chiamata per poter
 * proseguire con altre operazioni.
 *
 * @description :: Policy to check if a recipe exists.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

 /**
 * @apiDefine NoUserError
 *
 * @apiError NoUser The user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No user found"
 *     }
 */
module.exports = function (req, res, next) {
  	var userId = req.param('user');// l'id è un parametro
    
    if (!userId) { return next(); }

    User.findOne(userId).exec(function (err, user) {
      if(err){ return next(err); }

      if(!user) { return res.notFound({error: 'No user found'}); }

      req.user = user;// aggiungo la ricetta alla richiesta
      next();// prosegui
    });

};