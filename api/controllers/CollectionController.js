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

/**
 * Funzione per filtrare le raccolte private, ovvero per toglierle
 * dalla risposta se l'utente non risulta essere autorizzato a 
 * vederle. Infatti, soltanto l'autore di una raccolta privata
 * può vederla.
 */
var filterPrivateCollection = function (collection) {

    // se la raccolta è privata controllo se l'utente che ha
    // effettuato la richiesta è l'autore della raccolta
    if (collection && collection.isPrivate) {
        // riprendo l'utente dalla policy "attachUser"
        var user = req.payload;
        /**
         * se l'utente non è autenticato oppure non è l'autore allora 
         * non può vedere la raccolta
         */
        if (!user || collection.author.id != user.id)
            return null;
    }

    return collection;
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

                // filtro le collection private
                foundCollection = filterPrivateCollection(foundCollection);

                if (!foundCollection) {
                    return res.notFound({ error: 'No collection found' });
                }

                // se la raccolta è privata controllo se l'utente che ha
                // effettuato la richiesta è l'autore della raccolta
                if (foundCollection.isPrivate) {
                    var user = req.payload;
                    /**
                     * se l'utente non è autenticato oppure non è l'autore allora 
                     * non può vedere la raccolta
                     */
                    if (!user || foundCollection.author.id != user.id)
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

                // filtro le raccolte private
                foundCollections = foundCollections.filter(filterPrivateCollection);

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

            // Notifico l'evento ai followers dell'autore della raccolta
            Notification.notifyUserFollowers(user, createdCollection, 'Collection');

            return res.json(createdCollection);
        });
    },


    /**
     * @api {put} /collection/:collection Update a Collection
     * @apiName UpdateCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per aggiornare una propria collezione.
     * Si deve inviare qualsiasi richiesta con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} recipe JSON that represents the updated collection object.
     **/
    update: function(req, res, next) {

        var newCollection = req.body;

        // elimino gli attributi non modificabili (per protezione)
        delete newCollection.author;
        delete newCollection.recipes;
        delete newCollection.followers;
        delete newCollection.views;

        Collection.update({ id: req.collection.id }, newCollection).exec(function(err, updatedCollections) {
            if (err) { return next(err); }

            return res.json(updatedCollections[0]);
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

     /********************************************************************************************
     * 
     *                          UPLOADING DELLE IMMAGINI PER LE RACCOLTE
     * 
     ********************************************************************************************/

    /**
    * @api {put} /collection/:collection/upload_cover_image Upload the cover image
    * @apiName UploadCoverImage
    * @apiGroup Collection
    *
    * @apiDescription Serve per caricare l'immagine principale per una raccolta
    * Ogni richiesta necessità di autenticazione e di essere l'autore della
    * ricetta che si sta modificando.
    * Le richieste devono essere con codifica <strong>
    * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
    *
    * @apiUse TokenHeader
    *
    * @apiParam {File} coverImage Cover image file.
    *
    * @apiSuccess {json} collection JSON that represents the collection object.
    *
    * @apiSuccessExample {json} Success-Response-Example:
    *     HTTP/1.1 200 OK
    *     {
    *     "collection": 
    *       {
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
    * 
    * @apiError message Breve descrizione dell'errore che ha riscontrato il server.
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 400 Bad Request
    *     {
    *       "message": "No file was found"
    *     }
    * 
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 400 Bad Request
    *     {
    *       "message": "No file was uploaded"
    *     }
    */
    uploadCoverImage: function (req, res) {
        var collection = req.collection;

        var coverImage = req.file('image');
        if (!coverImage) { return res.badRequest('No file was found'); }

        if (process.env.NODE_ENV === 'production') {
            coverImage.upload({
                maxBytes: 5000000,
                dirname: ImageUploadService.localImagesDir

            }, function (err, filesUploaded) {
                // eseguo l'upload sul bucket s3
                ImageUploadService.s3Upload(err, filesUploaded, function (fileUrl) {

                    // se la raccolta ha già una immagine di copertina
                    // elimino l'immagine di copertina vecchia
                    if (collection.coverImageUrl) {
                        var filename = collection.coverImageUrl.replace(/^.*[\\\/]/, '');
                        S3FileService.deleteS3Object(filename);
                    }

                    // aggiorno la ricetta
                    Collection.update(collection.id, {
                        // aggiungo url dell'immagine appena caricata
                        coverImageUrl: fileUrl,

                    }).exec(function (err, updatedCollections) {
                        if (err) return res.negotiate(err);
                        return res.json(updatedCollections[0]);
                    });
                });
            });
        }
        else {
            coverImage.upload(
                ImageUploadService.localUploadConfiguration,
                function whenDone(err, uploadedFiles) {
                    if (err) { return res.negotiate(err); }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

                    // get the file name from a path
                    var filename = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');
                    var fileUrl = require('util').format('%s%s', sails.getBaseUrl(), '/images/' + filename);
                    //console.log("immagine di copertina: " + fileUrl);
                    Collection.update(collection.id, {
                        // aggiungo url dell'immagine appena caricata
                        coverImageUrl: fileUrl,

                    }).exec(function (err, updatedCollections) {
                        if (err) return res.negotiate(err);
                        //console.info(updatedRecipes[0]);
                        return res.json(updatedCollections[0]);
                    });
                });
        }
    },



    /**
    * @api {put} /collection/:collection/delete_cover_image Delete the cover image
    * @apiName DeleteCoverImage
    * @apiGroup Collection
    *
    * @apiDescription Serve per eliminare l'immagine principale per una raccolta
    * Ogni richiesta necessità di autenticazione e di essere l'autore della
    * ricetta che si sta modificando.
    * Le richieste devono essere con codifica <strong>
    * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
    *
    * @apiUse TokenHeader
    *
    * @apiSuccess {json} collection JSON that represents the collection object.
    *
    * @apiSuccessExample {json} Success-Response-Example:
    *     HTTP/1.1 200 OK
    *     {
    *     "collection": 
    *       {
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
    **/
    deleteCoverImage: function (req, res) {
        var collection = req.collection;
        
        if (process.env.NODE_ENV === 'production') {
            // se la raccolta ha già una immagine di copertina
                    // elimino l'immagine di copertina vecchia
                    if (collection.coverImageUrl) {
                        var filename = collection.coverImageUrl.replace(/^.*[\\\/]/, '');
                        S3FileService.deleteS3Object(filename);
                    }
        }

        // aggiorno la raccolta
        Collection.update(collection.id, {
            // aggiungo url dell'immagine appena caricata
            coverImageUrl: null,

        }).exec(function (err, updatedCollections) {
            if (err) return res.negotiate(err);
            return res.json(updatedCollections[0]);
        });

    }

};

