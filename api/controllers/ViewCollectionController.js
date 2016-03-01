/**
 * ViewCollectionController
 *
 * @description :: Server-side logic for managing Viewcollections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    /**
     * Permette di comunicare che una raccolta è stata vista dall'utente.
     */
    create: function (req, res, next) {
        var user = req.payload;

        // completo l'oggetto viewCollection
        var viewCollection = {user: user.id, collection: req.collection.id };

        //cerco se c'è gia uno stesso vote
        ViewCollection.find().where(viewCollection)
            .exec(function (err, views) {
                if (err) { return next(err); }
                
                if (views.length > 0) {
                    return res.json(200, views[0]) 
                } else {
                    ViewCollection.create(viewCollection).exec(function (err, viewCollectionCreated) {
                        if (err) { return next(err); }

                        return res.json(201, viewCollectionCreated);
                    });
                }
            });
    }
	
};