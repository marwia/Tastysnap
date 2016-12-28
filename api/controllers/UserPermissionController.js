/**
 * UserPermissionController
 *
 * @description :: Server-side logic for managing Userpermissions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    findOne: function (req, res, next) {
        var user = req.payload;

        UserPermission
            .findOne({ email: user.email })
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (!foundUser) { return res.json(401, { error: 'NoPermission' }); }

                return res.json(foundUser);
            });
    },


};

