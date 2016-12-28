/**
 * hasAdminPermission.js
 *
 * Questa è una politica che si occupa di verificare se l'utente loggato sul
 * social network ha i permessi di eseguire delle GET e DELETE sulle ricette,
 * raccolte, profili e commenti.
 *
 * @description :: Policy to check if user has a trial for a recipe.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
    var user = req.payload;

    UserPermission
        .findOne({email: user.email, type: 'admin'})
        .exec(function(err, foundUser) {
            if (err) { return next(err); }

            if (!foundUser) { return res.json(401, { error: 'NoPermission' }); }

            next();
        });


};