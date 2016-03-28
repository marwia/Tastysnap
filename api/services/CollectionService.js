/**
 * CollectionService
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

    /**
     * Metodo per ritrovare 'n' collection e popularle in modo standard.
     * Sostanzialmente serve a dare una definizione standard alle
     * liste di collection.
     */
    find: function (req, res, next, collectionIds) {

        Collection.find()
            .where({ id: collectionIds })
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('author')
            .populate('followers')
            .populate('views')
            .exec(function (err, foundCollections) {
                if (err) { return next(err); }
            
                // array di appoggio
                var collections = new Array();
            
                // conto gli elementi delle collection
                for (var i in foundCollections) {
                    foundCollections[i].viewsCount = foundCollections[i].views.length;
                    foundCollections[i].followersCount = foundCollections[i].followers.length;

                    /**
                     * Tolgo gli elementi popolati, per qualche ragione gli elementi che sono
                     * delle associazioni vengono automaticamente tolte quando si esegue
                     * il seguente metodo.
                     */
                    var obj = foundCollections[i].toObject();
                    collections.push(obj);
                }
                return res.json(collections);
            });

    }
};