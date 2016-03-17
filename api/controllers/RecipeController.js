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

// General configurations
// setting allowed file types
var allowedTypes = ['image/jpeg', 'image/png'];

// skipper default upload directory .tmp/uploads/
var localImagesDir = "./assets/images";

module.exports = {
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
    find: function(req, res, next) {
        Recipe.find()
            .where(actionUtil.parseCriteria(req))
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('author')
            .populate('views')
            .populate('votes')
            .populate('comments')
            .populate('trials')
            .exec(function(err, foundRecipes) {
                if (err) { return next(err); }

                if (foundRecipes.length == 0) {
                    return res.notFound({ error: 'No recipe found' });
                }

                // array di appoggio
                var recipes = new Array();

                // conto gli elementi delle collection
                for (var i in foundRecipes) {
                    foundRecipes[i].viewsCount = foundRecipes[i].views.length;
                    // calcolo dei voti positivi
                    foundRecipes[i].votesCount = 0;
                    for (var k in foundRecipes.votes) {
                        if (foundRecipes.votes[k].value > 0) {
                            foundRecipes[i].votesCount++;
                        }
                    }
                    foundRecipes[i].commentsCount = foundRecipes[i].comments.length;
                    foundRecipes[i].trialsCount = foundRecipes[i].trials.length;

                    /**
                     * Tolgo gli elementi popolati, per qualche ragione gli elementi che sono
                     * delle associazioni vengono automaticamente tolte quando si esegue
                     * il seguente metodo.
                     */
                    var obj = foundRecipes[i].toObject();
                    delete obj.description;// tolgo la descrizione della ricetta
                    recipes.push(obj);
                }
                return res.json(recipes);
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
    findOne: function(req, res, next) {
        var recipeId = req.param('id');
        if (!recipeId) { return next(); }

        Recipe.findOne(recipeId)
            .populate('author')
            .populate('views')
            .populate('votes')
            .populate('comments')
            .populate('trials')
            .populate('ingredientGroups')
            .exec(function(err, foundRecipe) {
                if (err) { return next(err); }

                if (!foundRecipe) { return res.notFound({ error: 'No recipe found' }); }

                // conteggi vari
                foundRecipe.viewsCount = foundRecipe.views.length;
                foundRecipe.votesCount = foundRecipe.votes.length;// aggiungere verifica sul value positivo
                foundRecipe.commentsCount = foundRecipe.comments.length;
                foundRecipe.trialsCount = foundRecipe.trials.length;

                /**
                 * Tolgo gli elementi popolati.
                 */
                var obj = foundRecipe.toObject();
                delete obj.views;
                delete obj.votes;
                delete obj.comments;
                delete obj.trials;

                return res.json(obj);
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
    create: function(req, res, next) {
        var user = req.payload;

        var recipe = req.body;
        // setto l'autore della ricetta
        recipe.author = user;
        // tolgo dall'oggetto ricetta elementi 'particolari'
        //delete recipe.coverImageUrl;
        delete recipe.coverImageFd;

        Recipe.create(recipe).exec(function(err, recipe) {
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
    destroy: function(req, res, next) {
        var recipe = req.recipe;

        //eliminazione dei file
        if (sails.config.environment === 'development') {
            // eliminazione immagine di copertina
            if (recipe.coverImageUrl != "") {
                var filename = recipe.coverImageUrl.split('/').pop();
                fs.unlink(localImagesDir + "/" + filename, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });
            }
            // eliminazione immagine di copertina sfocata
            if (recipe.blurredCoverImageUrl != "") {
                var filename = recipe.blurredCoverImageUrl.split('/').pop();
                fs.unlink(localImagesDir + "/" + filename, function(err) {
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
                fs.unlink(localImagesDir + "/" + filename, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });

            }
        }

        Recipe.destroy(recipe.id).exec(function(err) {
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
    getRecipeCategories: function(req, res) {
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
    getRecipeDosageTypes: function(req, res) {
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
    uploadCoverImage: function(req, res) {
        var recipe = req.recipe;

        var coverImage = req.file('image');
        if (!coverImage) { return res.badRequest('No file was found'); }

        coverImage.upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            saveAs: function(file, cb) {
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
        }, function whenDone(err, uploadedFiles) {
            if (err) { return res.negotiate(err); }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

            // get the file name from a path
            var filename = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');
            var fileUrl = require('util').format('%s%s', sails.getBaseUrl(), '/images/' + filename);

            Recipe.update(recipe.id, {

                // Generate a unique URL where the avatar can be downloaded.
                coverImageUrl: fileUrl,

            }).exec(function(err, updatedRecipes) {
                if (err) return res.negotiate(err);
                return res.json(updatedRecipes[0]);
            });
        });
    },


    /**
    * @api {put} /recipe/:recipe/upload_blurred_cover_image Upload a new image for a recipe
    * @apiName UploadBlurredRecipeImage
    * @apiGroup Recipe
    *
    * @apiDescription Serve per caricare l'immagine di copertina sfocata.
    *
    */
    uploadBlurredCoverImage: function(req, res) {
        var recipe = req.recipe;

        var blurredCoverImage = req.file('image');
        if (!blurredCoverImage) { return res.badRequest('No file was found'); }

        blurredCoverImage.upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            saveAs: function(file, cb) {
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
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            // get the file name from a path
            var filename = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');
            var fileUrl = require('util').format('%s%s', sails.getBaseUrl(), '/images/' + filename);
            console.log(fileUrl);

            Recipe.update(recipe.id, {

                // Generate a unique URL where the avatar can be downloaded.
                blurredCoverImageUrl: fileUrl,

            }).exec(function(err, updatedRecipes) {
                if (err) return res.negotiate(err);
                return res.json(updatedRecipes[0]);
            });
        });
    },

    /**
    * @api {put} /recipe/:recipe/upload_image Upload a new image for a recipe
    * @apiName UploadRecipeImage
    * @apiGroup Recipe
    *
    * @apiDescription Serve per caricare ulteriori immagini ad una ricetta.
    *
    */
    uploadImage: function(req, res) {
        var recipe = req.recipe;

        var image = req.file('image');
        if (!image) { return res.badRequest('No file was found'); }

        image.upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            saveAs: function(file, cb) {
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
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            // get the file name from a path
            var filename = uploadedFiles[0].fd.replace(/^.*[\\\/]/, '');
            var fileUrl = require('util').format('%s%s', sails.getBaseUrl(), '/images/' + filename);
            console.log(fileUrl);

            Recipe.findOne(recipe.id).exec(function(err, recipe) {
                if (err) return res.negotiate(err);
                
                if (recipe.otherImageUrls == null)
                    recipe.otherImageUrls = new Array();
                    
                recipe.otherImageUrls.push(fileUrl);
                recipe.save();
                return res.json(recipe);
            });
        });
    }


};

/**
 * Codice in comune
 */

// setting allowed file types
var allowedTypes = ['image/jpeg', 'image/png'];
// skipper default upload directory .tmp/uploads/
var localImagesDir = sails.config.appPath + "/assets/images";

