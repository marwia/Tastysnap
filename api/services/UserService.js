/**
 * UserService
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

    /**
     * Metodo per ritrovare 'n' utenti e popularle in modo standard.
     * Sostanzialmente serve a dare una definizione standard alle
     * liste di utenti.
     */
    find: function (req, res, next, userIds) {

        var whereCriteria = actionUtil.parseCriteria(req);
        if (userIds) {
            whereCriteria['id'] = userIds
        }

        User.find()
            .where(whereCriteria)
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('recipes')
            .populate('collections')
            .populate('followers')
            .populate('following')
            .populate('followingCollections')
            .exec(function (err, foundUsers) {
                if (err) { return next(err); }

                if (foundUsers.length == 0) { 
                    return res.notFound({ error: 'No user found' }); 
                }

                // array di appoggio
                var users = new Array();

                // conto gli elementi delle collection
                for (var i in foundUsers) {
                    foundUsers[i].recipesCount = foundUsers[i].recipes.length;
                    foundUsers[i].collectionsCount = foundUsers[i].collections.length;
                    foundUsers[i].followersCount = foundUsers[i].followers.length;
                    foundUsers[i].followingCount = foundUsers[i].following.length;
                    foundUsers[i].followingCollectionsCount = foundUsers[i].followingCollections.length;

                    /**
                     * Tolgo gli elementi popolati, per qualche ragione gli elementi che sono
                     * delle associazioni vengono automaticamente tolte quando si esegue
                     * il seguente metodo.
                     */
                    var obj = foundUsers[i].toObject();
                    delete obj.recipes;
                    delete obj.collections;
                    delete obj.followers;
                    delete obj.following;
                    delete obj.followingCollections;
                    // aggiungo in fondo all'array
                    users.push(obj);
                }

                return res.json(users);
            });
    }

};