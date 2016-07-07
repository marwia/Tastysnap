/**
 * CollectionController
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// libreria per gestire gli array
var _ = require('lodash');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

var setCollectionViewed = function (req, foundCollection) {
    var user = req.payload;

    if (user != null) {
        // completo l'oggetto viewCollection
        var viewCollection = { user: user.id, collection: foundCollection.id };

        ViewCollection.create(viewCollection).exec(function (err, viewCollectionCreated) {
            if (err) { console.log(err); }

        });
    }
};

module.exports = {

    /**
     * @api {get} /collection/:collection Get a Collection
     * @apiName GetCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per richiedere un collection in base all'id.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *
     */
    findOne: function (req, res, next) {
        var collectionId = req.param('collection');
        if (!collectionId) { return next(); }

        Collection.findOne(collectionId)
            .populate('author')
            .exec(function (err, foundCollection) {
                if (err) { return next(err); }

                if (!foundCollection) {
                    return res.notFound({ error: 'No collection found' });
                }

                var counts = {
                    viewsCount: function (cb) {
                        ViewCollection.count({ collection: foundCollection.id }).exec(function (err, result) {
                            cb(err, result);
                        });
                    },
                    followersCount: function (cb) {
                        FollowCollection.count({ collection: foundCollection.id }).exec(function (err, result) {
                            cb(err, result);
                        });
                    },
                    recipesCount: function (cb) {
                        CollectionRecipe.count({ collection: foundCollection.id }).exec(function (err, result) {
                            cb(err, result);
                        });
                    }
                };

                // eseguo lo precedenti funzioni in parallelo
                async.parallel(counts, function (err, resultSet) {
                    if (err) { return next(err); }

                    console.info(resultSet);

                    // copio i valori calcolati
                    foundCollection.viewsCount = resultSet.viewsCount;
                    foundCollection.followersCount = resultSet.followersCount;
                    foundCollection.recipesCount = resultSet.recipesCount;

                    // setto la collection come vista
                    // NOTA: tale codice è stato inserito qui
                    // per ragioni di performance
                    setCollectionViewed(req, foundCollection);

                    // richiamo la callback finale
                    return res.json(foundCollection);
                });
            });
    },

    /**
     * @api {get} /collection List Collections
     * @apiName ListCollections
     * @apiGroup Collection
     *
     * @apiDescription Serve per richiedere un lista di collezioni.
     * Attenzione che i risultati sono limitati ad un numero preciso di elementi, massimo 30 per richiesta.<br>
     * Questo end point accetta prametri.
     *
     * @apiParam {Integer} skip The number of records to skip (useful for pagination).
     * @apiParam {Integer} limit The maximum number of records to send back (useful for pagination). Defaults to 30. 
     * @apiParam {String} where Instead of filtering based on a specific attribute, you may instead choose to provide a where parameter with a Waterline WHERE criteria object, encoded as a JSON string.
     * @apiParam {String} sort The sort order. By default, returned records are sorted by primary key value in ascending order. 
     *
     * @apiParamExample Request-Param-Example:
     *     ?skip=6&limit=3
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *
     */
    find: function (req, res, next) {
        Collection.find()
            .where(actionUtil.parseCriteria(req))
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('author')
            .exec(function (err, foundCollections) {
                if (err) { return next(err); }

                if (foundCollections.length == 0) {
                    return res.notFound({ error: 'No collection found' });
                }

                // per ogni ricetta eseguo delle funzioni asincrono
                // ma aseptto che tutte finiscono (l'ultima callback)
                async.each(foundCollections, function (collection, callback) {
                    var counts = {
                        viewsCount: function (cb) {
                            ViewCollection.count({ collection: collection.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        },
                        followersCount: function (cb) {
                            FollowCollection.count({ collection: collection.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        },
                        recipesCount: function (cb) {
                            CollectionRecipe.count({ collection: collection.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        }
                    };

                    // eseguo lo precedenti funzioni in parallelo
                    async.parallel(counts, function (err, resultSet) {
                        if (err) { return next(err); }

                        console.info(resultSet);

                        // copio i valori calcolati
                        collection.viewsCount = resultSet.viewsCount;
                        collection.followersCount = resultSet.followersCount;
                        collection.recipesCount = resultSet.recipesCount;

                        // richiamo la callback finale
                        callback();
                    });

                }, function (err) {
                    if (err) { return next(err); }
                    // finish
                    var sort = actionUtil.parseSort(req);

                    // verifico che il criterio di ordinamento sia tra quei 
                    // valori contati
                    var substrings = ['viewsCount', 'followersCount', 'recipesCount'];
                    if (new RegExp(substrings.join("|")).test(sort)) {
                        // ordino i risultati secondo un criterio
                        foundCollections.sort(MyUtils.dynamicSort(sort));
                    }

                    return res.json(foundCollections);
                });
            });
    },

	/**
     * @api {post} /collection Create a new Collection
     * @apiName CreateCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per creare una collezione di ricette.
     * Visto che ogni collezione deve avere un autore, si deve effettuare qualsiasi
     * chiamata con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} title Collection title.
     * @apiParam {String} description Collection description.
     *
     * @apiParam {json} recipe JSON string that represents the Recipe.
     *
     * @apiParamExample Request-Body-Example:
     *     title=Spaghetti+fantastici&description=Questa+ricetta...
     *
     * @apiSuccess {json} collection JSON that represents the collection object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "collection": 
     *       {
     *		   "title" : "Menu primaverile",
     *         "description" : "Lista di piatti perfetti per un risveglio tutto naturale.",
     *         "createdAt": "2015-08-11T18:58:46.329Z",
     *         "updatedAt": "2015-08-11T18:58:46.329Z",
     *         "id": "55ca45e69b4246110b319cb1"
     *       }
     *     }
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    create: function (req, res, next) {
        var user = req.payload;

        var collection = req.body;
        // setto l'autore della ricetta
        collection.author = user;

        Collection.create(collection).exec(function (err, createdCollection) {
            if (err) { return next(err); }
            return res.json(createdCollection);
        });
    },

    /**
     * @api {delete} /collection/:collection Delete a Collection
     * @apiName DeleteCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per eliminare una propria collezione.
     * Si deve inviare qualsiasi richiesta con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} recipe JSON that represents the collection object deleted.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
		{
		  "recipes": [],
		  "author": {
		    "username": "cavallo",
		    "createdAt": "2015-09-15T13:59:50.559Z",
		    "updatedAt": "2015-09-15T13:59:50.559Z",
		    "id": "55f8245674cb8184028877b9"
		  },
		  "title": "Cazzate",
		  "description": "Bla bla bla...",
		  "createdAt": "2015-09-15T20:33:00.133Z",
		  "updatedAt": "2015-09-15T20:33:00.133Z",
		  "id": "55f8807c10dc1b5d0abda19a"
		}
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoPermissionError
     */

    // USO LA FUNZIONE DI DEFAULT CON UNA POLICY PER VERIFICARE I PERMESSI

};

