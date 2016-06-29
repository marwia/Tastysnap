/**
 * updateUserStats.js
 *
 * Questa è una politica che si occupa di aggiornare delle statistiche
 * legate agli utenti come la data dell'ultimo accesso, ecc..
 *
 * @description :: Policy to update user stats.
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
    console.log("hello!!!");
    console.info(req.payload);
    if (req.payload) {
      var user = req.payload;
      User.update(user.id, {

        lastSeen: new Date()

      }).exec(function (err, updatedUsers) {
        if (err) { console.info(err); }
        console.log(updatedUsers);
      });
    }

    next();// prosegui

};