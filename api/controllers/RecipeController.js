/**
 * RecipeController
 *
 * @description :: Server-side logic for managing Recipes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

/**
 * Module dependencies
 * 
 * Prese da https://github.com/balderdashy/sails/blob/master/lib/hooks/blueprints/actions/find.js
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var md5 = require('md5');
var fs = require('fs');

// libreria per gestire gli array
var _ = require('lodash');

var wlFilter = require('waterline-criteria');

/**
 * Codice in comune
 */

// setting allowed file types
var allowedTypes = ['image/jpeg', 'image/png'];
// skipper default upload directory .tmp/uploads/
var localImagesDir = sails.config.appPath + "/assets/images";

var server_name = "https://tastysnap.com";
var cdn_url = "https://tastysnapcdn.s3.amazonaws.com/";

/**
 * Funzioni comuni nell'upload di immagini
 */
var localUploadConfiguration = {
    // don't allow the total upload size to exceed ~10MB
    maxBytes: 5000000,
    saveAs: function (file, cb) {
        var d = new Date();
        var extension = file.filename.split('.').pop();

        if (extension == 'blob') { extension = 'jpg'; }
        // generating unique filename with extension
        var uuid = md5(d.getMilliseconds()) + "." + extension;

        console.log(file.headers['content-type']);
        // seperate allowed and disallowed file types
        if (allowedTypes.indexOf(file.headers['content-type']) === -1) {
            // don't accept not allowed file types
            return res.badRequest('Not supported file type');
        } else {
            // save as allowed files
            cb(null, localImagesDir + "/" + uuid);
        }
    }
};

var s3Upload = function (err, filesUploaded, whenDone) {
    if (err) {
        return res.badRequest();
    }
    // If no files were uploaded, respond with an error.
    if (filesUploaded.length === 0) {
        return res.badRequest('No file was uploaded');
    }

    // eseguo l'upload dell'immagine sul bucket S3
    S3FileService.uploadS3Object(filesUploaded[0], function (err, uploadedFiles) {

        if (err || !uploadedFiles) {
            return res.badRequest("Errore nell'upload del file sul bucket S3");
        }

        var filename = filesUploaded[0].fd.replace(/^.*[\\\/]/, '');
        var fileUrl = cdn_url + filename;

        // elimino il file temporaneo
        fs.unlink(filesUploaded[0].fd, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("File deleted successfully!");
        });

        whenDone(fileUrl);
    });
};

module.exports = {

    /**
     * @api {get} /recipe/search Search Recipes
     * @apiName SearchRecipes
     * @apiGroup Recipe
     *
     * @apiDescription Serve per richiedere un lista di ricette applicando filtri di ricerca.
     * Attenzione che i risultati sono limitati ad un numero preciso di ricette, massimo 30 per richiesta.<br>
     * Questo end point accetta prametri.
     *
     * @apiParam {Integer} skip The number of records to skip (useful for pagination).
     * @apiParam {Integer} limit The maximum number of records to send back (useful for pagination). Defaults to 30. 
     * @apiParam {String} where Instead of filtering based on a specific attribute, you may instead choose to provide a where parameter with a Waterline WHERE criteria object, encoded as a JSON string.
     * @apiParam {String} sort The sort order. By default, returned records are sorted by primary key value in ascending order. 
     *
     * @apiParamExample Skip-Limit-Param-Example:
     *     ?skip=6&limit=3
     * 
     * @apiParamExample Not-In-Products-Param-Example:
     *     ?where{"products":{"!":["product_id1", "product_id2"]}}
     * 
     * @apiParamExample In-Products-Param-Example:
     *     ?where{"products": ["product_id1", "product_id2"]}
     *
     * @apiParamExample Review-Param-Example:
     *     ?where{"difficulty":{">":3, "<=":5}, "calories":{">":4, "<=":5}}
     * 
     * @apiParamExample Category-Param-Example:
     *     ?where{"category": ["primi piatti", "zuppe"]}
     */
    advancedSearch: function (req, res, next) {
        var originalCriteria = actionUtil.parseCriteria(req);
        var sortCriteria = actionUtil.parseSort(req);
        var filteredCriteria = actionUtil.parseCriteria(req);

        console.info("sort criteria: ", sortCriteria);

        console.info("NOT filtered criteria: ", filteredCriteria);

        // cancello i criteri di ricerca secondari
        delete filteredCriteria["difficulty"];
        delete filteredCriteria["cost"];
        delete filteredCriteria["calories"];

        delete filteredCriteria["products"];

        console.info("filtered criteria: ", filteredCriteria);

        Recipe.find()
            .where(filteredCriteria)
            .populate('author')
            .exec(function (err, foundRecipes) {
                if (err) { return next(err); }

                if (foundRecipes.length == 0) {
                    return res.notFound({ error: 'No recipe found' });
                }

                /**
                 * DICHIARAZIONE DEI TASK (di popolamento, conteggio, ecc...)
                 */

                // per ogni ricetta eseguo delle funzioni asincrono
                // ma aseptto che tutte finiscono (l'ultima callback)
                async.each(foundRecipes, function (recipe, callback) {
                    // conteggi (obbligatorio)
                    var counts = {
                        commentsCount: function (cb) {
                            Comment.count({ recipe: recipe.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        },
                        votesCount: function (cb) {
                            VoteRecipe.count({ recipe: recipe.id, value: 1 }).exec(function (err, result) {
                                cb(err, result);
                            });
                        },
                        viewsCount: function (cb) {
                            ViewRecipe.count({ recipe: recipe.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        },
                        trialsCount: function (cb) {
                            TryRecipe.count({ recipe: recipe.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        }
                    };

                    // popolo gli ingredienti (opzionale)

                    var populateIngredients = function (cb) {

                        IngredientGroup
                            .find({ recipe: recipe.id })
                            .populate('ingredients')
                            .exec(function (err, result) {
                                if (!err && result) {
                                    var productIds = [];
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].ingredients)
                                            for (var j = 0; j < result[i].ingredients.length; j++) {
                                                productIds.push(result[i].ingredients[j].product)
                                            }
                                    }
                                    cb(err, productIds);
                                } else {
                                    cb(err, -1);// no data
                                }
                            });
                    }

                    // calcolo dei voti medi (opzionale)

                    var averagesBase = function (cb, typology) {
                        ReviewRecipe.find({ recipe: recipe.id, typology: typology }).exec(function (err, result) {
                            if (!err && result && result.length > 0) {
                                var tot = 0;
                                for (var i = 0; i < result.length; i++) {
                                    var tot = + result[i].value;
                                }
                                var avg = tot / result.length;
                                cb(err, avg);
                            } else {
                                cb(err, -1);// no data
                            }
                        });
                    };

                    var averages = {
                        difficulty: function (cb) {
                            averagesBase(cb, "difficulty");
                        },
                        cost: function (cb) {
                            averagesBase(cb, "cost");
                        },
                        calories: function (cb) {
                            averagesBase(cb, "calories");
                        }
                    };

                    /**
                     * DETERMINAZIONE DEI TASK DA ESEGUIRE
                     */

                    var tasks = counts;

                    if (originalCriteria["difficulty"]
                        || (sortCriteria && sortCriteria.indexOf("difficulty") > -1))
                        tasks["difficulty"] = averages.difficulty;
                    if (originalCriteria["cost"]
                        || (sortCriteria && sortCriteria.indexOf("cost") > -1))
                        tasks["cost"] = averages.cost;
                    if (originalCriteria["calories"]
                        || (sortCriteria && sortCriteria.indexOf("calories") > -1))
                        tasks["calories"] = averages.calories;

                    if (originalCriteria["products"])
                        tasks["products"] = populateIngredients;

                    /**
                     * ESECUZIONE DEI TASK IN PARALLELO
                     */

                    async.parallel(tasks, function (err, resultSet) {
                        if (err) { return next(err); }
                        console.info(resultSet);
                        // copio i valori calcolati
                        recipe.commentsCount = resultSet.commentsCount;
                        recipe.votesCount = resultSet.votesCount;
                        recipe.viewsCount = resultSet.viewsCount;
                        recipe.trialsCount = resultSet.trialsCount;

                        // copio i valori opzionali
                        recipe.difficulty = resultSet.difficulty;
                        recipe.cost = resultSet.cost;
                        recipe.calories = resultSet.calories;

                        recipe.products = resultSet.products;

                        // richiamo la callback finale
                        callback();
                    });

                }, function (err) {
                    if (err) { return next(err); }
                    /**
                     * FINISH
                     */

                    /**
                     * FILTER
                     */

                    // in base al voto
                    if (originalCriteria["difficulty"]) {
                        foundRecipes = wlFilter(foundRecipes, {
                            where: {
                                difficulty: originalCriteria["difficulty"]
                            }
                        }).results;
                    }

                    if (originalCriteria["cost"]) {
                        foundRecipes = wlFilter(foundRecipes, {
                            where: {
                                cost: originalCriteria["cost"]
                            }
                        }).results;
                    }

                    if (originalCriteria["calories"]) {
                        foundRecipes = wlFilter(foundRecipes, {
                            where: {
                                calories: originalCriteria["calories"]
                            }
                        }).results;
                    }

                    // in base ai prodotti (AND)
                    if (originalCriteria["products"]) {
                        var notIn = false;
                        var products = originalCriteria["products"];;
                        if (products["!"]) {
                            notIn = true;
                            products = products["!"]
                        }

                        // mi assicuro di avere un array
                        if (!(products instanceof Array)) {
                            products = [products];
                        }

                        foundRecipes = foundRecipes.filter(function (el) {
                            return notIn ? !MyUtils.superBag(el.products, products) : MyUtils.superBag(el.products, products);
                        });
                    }

                    /**
                     * SORT
                     */

                    /**
                     * Verifico che il criterio di ordinamento sia tra 
                     * i valori permessi.
                     */
                    var substrings = ['commentsCount', 'votesCount', 'viewsCount', 'trialsCount',
                        'difficulty', 'cost', 'calories', 'title', 'preparationTime', 'category', 'author'];
                    if (new RegExp(substrings.join("|")).test(sortCriteria)) {
                        // ordino i risultati secondo un criterio
                        foundRecipes.sort(MyUtils.dynamicSort(sortCriteria));
                    }

                    /**
                     * SKIP OR LIMIT
                     */

                    var limit = sails.config.blueprints.defaultLimit;
                    if (actionUtil.parseLimit(req))
                        limit = actionUtil.parseLimit(req);
                    var skip = 0;
                    if (actionUtil.parseSkip(req))
                        skip = actionUtil.parseSkip(req);
                    foundRecipes.slice(skip, skip + limit);

                    return res.json(foundRecipes);
                });

            });
    },

    /**
     * @api {get} /recipe/search/coordinates List Near Recipes
     * @apiName ListNearRecipes
     * @apiGroup Recipe
     *
     * @apiDescription Serve per richiedere un lista di ricette vicine ad un punto 
     * caratterizzato da coordinate.
     * Attenzione che i risultati sono limitati ad un numero preciso di ricette, massimo 30 per richiesta.<br>
     * Questo end point accetta prametri.
     *
     * @apiParam {Number} latitude Latitude of the point.
     * @apiParam {Number} longitude Longitutde of the point.
     * @apiParam {maxDistance} maxDistance Max distance from the point in meteres.
     *
     * @apiParamExample Request-Param-Example:
     *     ?latitude=43&longitude=12&maxDistance=60000
     *
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    searchByCoordinates: function (req, res, next) {

        var searchCriteria = actionUtil.parseCriteria(req);
        if (!searchCriteria.longitude || !searchCriteria.latitude)
            return res.badRequest("No coordinates");

        // distanza in metri
        var maxDistance = 50000;
        if (searchCriteria.maxDistance)
            maxDistance = searchCriteria.maxDistance;

        Recipe.native(function (err, collection) {
            collection.find({

                "coordinates": {
                    "$near": {
                        "$maxDistance": Number(maxDistance),
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [
                                Number(searchCriteria.longitude),
                                Number(searchCriteria.latitude)]
                        }
                    }
                }
            })
                //.sort({ "created": -1 })
                //.limit(24)
                .toArray(function (err, docs) {
                    // Handle Error and use docs
                    if (err) { return next(err); }

                    if (docs.length == 0) {
                        return res.notFound();
                    }

                    var recipeIdList = docs.map(function (recipe) {
                        return recipe._id
                    });
                    
                    // remove consumed query params
                    delete searchCriteria["longitude"];
                    delete searchCriteria["latitude"];
                    delete searchCriteria["maxDistance"];
                    
                    // richiamo la funzione di ricerca "normale" 
                    // specificando due parametri speciali
                    sails.controllers.recipe.find(req, res, next, {id: recipeIdList}, searchCriteria);
 
                });
        });
    },

    /**
     * @api {get} /recipe List Recipes
     * @apiName ListRecipes
     * @apiGroup Recipe
     *
     * @apiDescription Serve per richiedere un lista di ricette.
     * Attenzione che i risultati sono limitati ad un numero preciso di ricette, massimo 30 per richiesta.<br>
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
     *     [
     *{
     *  "votes": [],
     *  "comments": [],
     *  "collections": [],
     *  "author": {
     *    "username": "cavallo",
     *    "createdAt": "2015-07-24T17:28:10.577Z",
     *    "updatedAt": "2015-07-24T17:28:10.577Z",
     *    "id": "55b275aa3e4935bc028d02c0"
     *  },
     *  "Title": "Carbonara new",
     *  "Description": "dedsds sd sdsd",
     *  "upvotes": 0,
     *  "createdAt": "2015-08-13T13:31:25.262Z",
     *  "updatedAt": "2015-08-13T13:31:25.262Z",
     *   "id": "55cc9c2de75edbb10e6508a1"
     * },
     * {
     *  "votes": [],
     *   "comments": [],
     *  "collections": [],
     *  "author": {
     *    "username": "cavallo",
     *   "createdAt": "2015-07-24T17:28:10.577Z",
     *    "updatedAt": "2015-07-24T17:28:10.577Z",
     *    "id": "55b275aa3e4935bc028d02c0"
     *  },
     *  "Title": "Carbonara",
     *  "Description": "dedsds sd sdsd",
     *  "upvotes": 0,
     *  "createdAt": "2015-08-13T14:05:26.104Z",
     *  "updatedAt": "2015-08-13T14:05:26.104Z",
     *  "id": "55cca42654ceca27112f4733"
     *},
     *{
     *  "votes": [],
     *  "comments": [],
     *  "collections": [],
     *  "author": {
     *    "username": "cavallo",
     *    "createdAt": "2015-07-24T17:28:10.577Z",
     *    "updatedAt": "2015-07-24T17:28:10.577Z",
     *    "id": "55b275aa3e4935bc028d02c0"
     *  },
     *  "Title": "Carbonara 2",
     *  "Description": "dedsds sd sdsd",
     *  "upvotes": 0,
     *  "createdAt": "2015-08-13T14:06:59.150Z",
     *  "updatedAt": "2015-08-13T14:06:59.150Z",
     *  "id": "55cca48354ceca27112f4734"
     *}
     *]
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     */
    find: function (req, res, next, recipeIdList, whereCriteria) {
        Recipe.find(recipeIdList)
            .where(whereCriteria ? whereCriteria : actionUtil.parseCriteria(req))
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('author')
            .exec(function (err, foundRecipes) {
                if (err) { return next(err); }

                if (foundRecipes.length == 0) {
                    return res.notFound({ error: 'No recipe found' });
                }

                // per ogni ricetta eseguo delle funzioni asincrono
                // ma aseptto che tutte finiscono (l'ultima callback)
                async.each(foundRecipes, function (recipe, callback) {
                    var counts = {
                        commentsCount: function (cb) {
                            Comment.count({ recipe: recipe.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        },
                        votesCount: function (cb) {
                            VoteRecipe.count({ recipe: recipe.id, value: 1 }).exec(function (err, result) {
                                cb(err, result);
                            });
                        },
                        viewsCount: function (cb) {
                            ViewRecipe.count({ recipe: recipe.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        },
                        trialsCount: function (cb) {
                            TryRecipe.count({ recipe: recipe.id }).exec(function (err, result) {
                                cb(err, result);
                            });
                        }
                    };

                    // eseguo lo precedenti funzioni in parallelo
                    async.parallel(counts, function (err, resultSet) {
                        if (err) { return next(err); }

                        // copio i valori calcolati
                        recipe.commentsCount = resultSet.commentsCount;
                        recipe.votesCount = resultSet.votesCount;
                        recipe.viewsCount = resultSet.viewsCount;
                        recipe.trialsCount = resultSet.trialsCount;

                        // richiamo la callback finale
                        callback();
                    });

                }, function (err) {
                    if (err) { return next(err); }
                    // finish
                    var sort = actionUtil.parseSort(req);

                    // verifico che il criterio di ordinamento sia tra quei 
                    // valori contati
                    var substrings = ['commentsCount', 'votesCount', 'viewsCount', 'trialsCount'];
                    if (new RegExp(substrings.join("|")).test(sort)) {
                        // ordino i risultati secondo un criterio
                        foundRecipes.sort(MyUtils.dynamicSort(sort));
                    }

                    return res.json(foundRecipes);
                });

            });
    },


    /**
    * @api {get} /recipe/:id Get a Recipe
    * @apiName GetRecipe
    * @apiGroup Recipe
    *
    * @apiDescription Serve per caricare tutti i dettagli di una ricetta.
    *
    * @apiParam {String} id Recipe id.
    *
    * @apiSuccess {json} recipe JSON that represents the recipe object.
    *
    * @apiSuccessExample {json} Success-Response-Example:
    *     HTTP/1.1 200 OK
    *     {
    *     "recipe": 
    *       {
    *         "createdAt": "2015-08-11T18:58:46.329Z",
    *         "updatedAt": "2015-08-11T18:58:46.329Z",
    *         "id": "55ca45e69b4246110b319cb1"
    *       }
    *     }
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 404 Not Found
    */
    findOne: function (req, res, next) {
        var recipeId = req.param('id');
        if (!recipeId) { return next(); }

        Recipe.findOne(recipeId)
            .populate('author')
            .populate('ingredientGroups')
            .exec(function (err, foundRecipe) {
                if (err) { return next(err); }

                if (!foundRecipe) { return res.notFound({ error: 'No recipe found' }); }

                // per ogni ricetta eseguo delle funzioni asincrono
                // ma aseptto che tutte finiscono (l'ultima callback)

                var counts = {
                    commentsCount: function (cb) {
                        Comment.count({ recipe: foundRecipe.id }).exec(function (err, result) {
                            cb(err, result);
                        });
                    },
                    votesCount: function (cb) {
                        VoteRecipe.count({ recipe: foundRecipe.id, value: 1 }).exec(function (err, result) {
                            cb(err, result);
                        });
                    },
                    viewsCount: function (cb) {
                        ViewRecipe.count({ recipe: foundRecipe.id }).exec(function (err, result) {
                            cb(err, result);
                        });
                    },
                    trialsCount: function (cb) {
                        TryRecipe.count({ recipe: foundRecipe.id }).exec(function (err, result) {
                            cb(err, result);
                        });
                    }
                };

                // eseguo lo precedenti funzioni in parallelo
                async.parallel(counts, function (err, resultSet) {
                    if (err) { return next(err); }

                    // copio i valori calcolati
                    foundRecipe.commentsCount = resultSet.commentsCount;
                    foundRecipe.votesCount = resultSet.votesCount;
                    foundRecipe.viewsCount = resultSet.viewsCount;
                    foundRecipe.trialsCount = resultSet.trialsCount;

                    // richiamo la callback finale
                    return res.json(foundRecipe);
                });
            });
    },

    /**
     * @api {post} /recipe Create a new Recipe
     * @apiName CreateRecipe
     * @apiGroup Recipe
     *
     * @apiDescription Serve per caricare un ricetta creata da un utente.
     * Visto che ogni ricetta deve avere un autore, si deve inviare qualsiasi
     * ricetta con il token del suo autore.<br>
     * Una volta creata la ricetta, il client deve proseguire creando prima i 
     * gruppi di ingredienti e poi gli ingredienti di ogni gruppo. Una volta finita
     * questa serie di creazioni, la ricetta può essere considerata creata con successo.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} title Recipe title.
     * @apiParam {String} description Recipe description.
     *
     * @apiParam {json} recipe JSON string that represents the Recipe.
     *
     * @apiParamExample Request-Body-Example:
     *     title=Spaghetti+fantastici&description=Questa+ricetta...
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "recipe": 
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
     */
    create: function (req, res, next) {
        var user = req.payload;

        var recipe = req.body;
        // setto l'autore della ricetta
        recipe.author = user;
        // tolgo dall'oggetto ricetta elementi 'particolari'
        //delete recipe.coverImageUrl;
        delete recipe.coverImageFd;

        Recipe.create(recipe).exec(function (err, recipe) {
            if (err) { return next(err); }
            return res.json(recipe);
        });
    },

    /**
     * @api {delete} /recipe Delete a Recipe
     * @apiName DeleteRecipe
     * @apiGroup Recipe
     *
     * @apiDescription Serve per eliminare un ricetta creata da un utente.
     * Si deve inviare qualsiasi richiesta con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "recipe": 
     *       {
     *         "title": "Spagoasd"
     *         "description": "..."
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
     * @apiUse NoPermissionError
     */
    destroy: function (req, res, next) {
        var recipe = req.recipe;

        //eliminazione dei file
        if (sails.config.environment === 'development') {
            // eliminazione immagine di copertina
            if (recipe.coverImageUrl != "") {
                var filename = recipe.coverImageUrl.split('/').pop();
                fs.unlink(localImagesDir + "/" + filename, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });
            }
            // eliminazione immagine di copertina sfocata
            if (recipe.blurredCoverImageUrl != "") {
                var filename = recipe.blurredCoverImageUrl.split('/').pop();
                fs.unlink(localImagesDir + "/" + filename, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });
            }
            // eliminazione delle ulteriori immagini
            for (var i in recipe.otherImageUrls) {
                var fileUrl = recipe.otherImageUrls[i];
                var filename = fileUrl.split('/').pop();
                fs.unlink(localImagesDir + "/" + filename, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });
            }
        }
        else {
            // eliminazione immagine di copertina
            if (recipe.coverImageUrl != "") {
                var filename = recipe.coverImageUrl.split('/').pop();
                S3FileService.deleteS3Object(filename);
            }
            // eliminazione immagine di copertina sfocata
            if (recipe.blurredCoverImageUrl != "") {
                var filename = recipe.blurredCoverImageUrl.split('/').pop();
                S3FileService.deleteS3Object(filename);
            }
            // eliminazione delle ulteriori immagini
            for (var i in recipe.otherImageUrls) {
                var fileUrl = recipe.otherImageUrls[i];
                var filename = fileUrl.split('/').pop();
                S3FileService.deleteS3Object(filename);
            }
        }

        Recipe.destroy(recipe.id).exec(function (err) {
            if (err) { return next(err); }
            return res.send(204, null);// eliminata
        });
    },

    /**
     * @api {put} /recipe/:id Update a Recipe
     * @apiName UpdateRecipe
     * @apiGroup Recipe
     *
     * @apiDescription Serve per applicare delle modifiche ad un ricetta.
     * Visto che ogni ricetta deve avere un autore, soltanto l'autore può
     * eseguire l'update.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} id Recipe id.
     * @apiParam {Object} parameters Pass in body parameters with the same name as the attributes defined on your model to set those values on the desired record.
     *
     * @apiParamExample Request-Body-Example:
     *     title=Spaghetti+fantastici&description=Questa+ricetta...
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "recipe": 
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
     * @apiUse NoPermissionError
     */

    /**
    * @api {get} /recipe/categories Get all recipe cetegories
    * @apiName GetRecipeCategories
    * @apiGroup Recipe
    *
    * @apiDescription Serve per ottenere la lista delle categorie di ricette.
    * 
    * @apiSuccess {json} recipe JSON that represents the recipe categories object.
    *
    * @apiSuccessExample {json} Success-Response-Example:
    *     HTTP/1.1 200 OK
    *     {
    *          "type": "string",
    *          "enum": [
    *               "first courses",
    *               "second courses",
    *               "soups",
    *               "salads",
    *               "appetizers and snacks",
    *               "desserts and cakes",
    *               "beverages",
    *               "cocktails",
    *               "side dishes",
    *               "jams and preserves",
    *               "sauces"
    *          ]
    *      }
    *
    */
    getRecipeCategories: function (req, res) {
        return res.json(sails.models.recipe.definition.category);
    },

    /**
     * @api {get} /recipe/dosage_types Get recipe dosage types
     * @apiName GetRecipeDosageTypes
     * @apiGroup Recipe
     *
     * @apiDescription Serve per ottenere la lista dei vari tipi di 
     * dosaggi si può associare alla ricetta.
     * 
     * @apiSuccess {json} recipe JSON that represents the dosage types object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *          "type": "string",
     *          "enum": [
     *               "persons",
     *               "units"
     *          ]
     *      }
     *
     */
    getRecipeDosageTypes: function (req, res) {
        return res.json(sails.models.recipe.definition.dosagesType);
    },

    /********************************************************************************************
     * 
     *                          UPLOADING DELLE IMMAGINI PER LE RICETTE
     * 
     ********************************************************************************************/

    /**
    * @api {put} /recipe/:recipe/upload_cover_image Upload the cover image
    * @apiName UploadCoverImage
    * @apiGroup Recipe
    *
    * @apiDescription Serve per caricare l'immagine principale per una ricetta
    * Ogni richiesta necessità di autenticazione e di essere l'autore della
    * ricetta che si sta modificando.
    * Le richieste devono essere con codifica <strong>
    * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
    *
    * @apiUse TokenHeader
    *
    * @apiParam {File} coverImage Cover image file.
    *
    * @apiSuccess {json} recipe JSON that represents the recipe object.
    *
    * @apiSuccessExample {json} Success-Response-Example:
    *     HTTP/1.1 200 OK
    *     {
    *     "recipe": 
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
        var recipe = req.recipe;

        var coverImage = req.file('image');
        if (!coverImage) { return res.badRequest('No file was found'); }

        if (process.env.NODE_ENV === 'production') {
            coverImage.upload({
                maxBytes: 5000000,
                dirname: localImagesDir

            }, function (err, filesUploaded) {
                // eseguo l'upload sul bucket s3
                s3Upload(err, filesUploaded, function (fileUrl) {

                    // se la ricetta ha già una immagine di copertina
                    // elimino l'immagine di copertina vecchia
                    if (recipe.coverImageUrl) {
                        var filename = recipe.coverImageUrl.replace(/^.*[\\\/]/, '');
                        S3FileService.deleteS3Object(filename);
                    }

                    // aggiorno la ricetta
                    Recipe.update(recipe.id, {
                        // aggiungo url dell'immagine appena caricata
                        coverImageUrl: fileUrl,

                    }).exec(function (err, updatedRecipes) {
                        if (err) return res.negotiate(err);
                        return res.json(updatedRecipes[0]);
                    });
                });
            });
        }
        else {
            coverImage.upload(
                localUploadConfiguration,
                function whenDone(err, uploadedFiles) {
                    if (err) { return res.negotiate(err); }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

                    // get the file name from a path
                    var filename = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');
                    var fileUrl = require('util').format('%s%s', sails.getBaseUrl(), '/images/' + filename);
                    //console.log("immagine di copertina: " + fileUrl);
                    Recipe.update(recipe.id, {
                        // aggiungo url dell'immagine appena caricata
                        coverImageUrl: fileUrl,

                    }).exec(function (err, updatedRecipes) {
                        if (err) return res.negotiate(err);
                        //console.info(updatedRecipes[0]);
                        return res.json(updatedRecipes[0]);
                    });
                });
        }
    },


    /**
    * @api {put} /recipe/:recipe/upload_blurred_cover_image Upload a new image for a recipe
    * @apiName UploadBlurredRecipeImage
    * @apiGroup Recipe
    *
    * @apiDescription Serve per caricare l'immagine di copertina sfocata.
    *
    */
    uploadBlurredCoverImage: function (req, res) {
        var recipe = req.recipe;

        var blurredCoverImage = req.file('image');
        if (!blurredCoverImage) { return res.badRequest('No file was found'); }

        if (process.env.NODE_ENV === 'production') {
            coverImage.upload({
                maxBytes: 5000000,
                dirname: localImagesDir

            }, function (err, filesUploaded) {
                // eseguo l'upload sul bucket s3
                s3Upload(err, filesUploaded, function (fileUrl) {

                    // se la ricetta ha già una immagine di copertina
                    // elimino l'immagine di copertina vecchia
                    if (recipe.blurredCoverImageUrl) {
                        var filename = recipe.blurredCoverImageUrl.replace(/^.*[\\\/]/, '');
                        S3FileService.deleteS3Object(filename);
                    }

                    // aggiorno la ricetta
                    Recipe.update(recipe.id, {
                        // aggiungo url dell'immagine appena caricata
                        blurredCoverImageUrl: fileUrl,

                    }).exec(function (err, updatedRecipes) {
                        if (err) return res.negotiate(err);
                        return res.json(updatedRecipes[0]);
                    });
                });
            });
        }
        else {
            blurredCoverImage.upload(
                localUploadConfiguration,
                function whenDone(err, uploadedFiles) {
                    if (err) { return res.negotiate(err); }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }

                    // get the file name from a path
                    var filename = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');
                    var fileUrl = require('util').format('%s%s', sails.getBaseUrl(), '/images/' + filename);

                    Recipe.update(recipe.id, {
                        // aggiungo url dell'immagine appena caricata
                        blurredCoverImageUrl: fileUrl,

                    }).exec(function (err, updatedRecipes) {
                        if (err) return res.negotiate(err);
                        return res.json(updatedRecipes[0]);
                    });
                });
        }
    },

    /**
    * @api {put} /recipe/:recipe/upload_image Upload a new image for a recipe
    * @apiName UploadRecipeImage
    * @apiGroup Recipe
    *
    * @apiDescription Serve per caricare ulteriori immagini ad una ricetta.
    *
    */
    uploadImage: function (req, res) {
        var recipe = req.recipe;

        var image = req.file('image');
        if (!image) { return res.badRequest('No file was found'); }

        if (process.env.NODE_ENV === 'production') {
            coverImage.upload({
                maxBytes: 5000000,
                dirname: localImagesDir

            }, function (err, filesUploaded) {
                // eseguo l'upload sul bucket s3
                s3Upload(err, filesUploaded, function (fileUrl) {

                    if (recipe.otherImageUrls == null)
                        recipe.otherImageUrls = new Array();

                    // aggiungo url dell'immagine appena caricata
                    recipe.otherImageUrls.push(fileUrl);

                    // aggiorno la ricetta
                    Recipe.update(recipe.id, {
                        // aggiungo url dell'immagine appena caricata
                        otherImageUrls: recipe.otherImageUrls,

                    }).exec(function (err, updatedRecipes) {
                        if (err) return res.negotiate(err);
                        return res.json(updatedRecipes[0]);
                    });
                });
            });
        }
        else {
            image.upload(
                localUploadConfiguration,
                function whenDone(err, uploadedFiles) {
                    if (err) { return res.negotiate(err); }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }

                    // get the file name from a path
                    var filename = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');
                    var fileUrl = require('util').format('%s%s', sails.getBaseUrl(), '/images/' + filename);

                    if (recipe.otherImageUrls == null)
                        recipe.otherImageUrls = new Array();

                    // aggiungo url dell'immagine appena caricata
                    recipe.otherImageUrls.push(fileUrl);

                    // aggiorno la ricetta
                    Recipe.update(recipe.id, {
                        // aggiungo url dell'immagine appena caricata
                        otherImageUrls: recipe.otherImageUrls,

                    }).exec(function (err, updatedRecipes) {
                        if (err) return res.negotiate(err);
                        return res.json(updatedRecipes[0]);
                    });
                });
        }
    }


};



