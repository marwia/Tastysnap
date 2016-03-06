/**
 * CollectionController
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// libreria per gestire gli array
var _ = require('lodash');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

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
            .populate('followers')
            .populate('views')
            .exec(function (err, foundCollection) {
                if (err) { return next(err); }

                if (!foundCollection) { return res.notFound({ error: 'No collection found' }); }
            
                // conto gli elementi delle collection
                foundCollection.followersCount = foundCollection.followers.length;
                foundCollection.viewsCount = foundCollection.views.length;
            
                /**
                 * Tolgo gli elementi popolati, per qualche ragione gli elementi che sono
                 * delle associazioni vengono automaticamente tolte quando si esegue
                 * il seguente metodo.
                 */
                var obj = foundCollection.toObject();

                return res.json(obj);
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
    },


    /**
     * @api {get} /collection/:collection/recipe List recipes for a Collection
     * @apiName ListRecipeForCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per richiedere la lista di ricette che sono in un collezione.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *
     */
    getRecipes: function (req, res, next) {
        var collection = req.collection;

        Collection
            .findOne(collection.id)
            .populate('recipes')
            .exec(function (err, foundCollection) {
                if (err) { return next(err); }
                
                // Array con id di ricette viste
                var recipeIds = new Array();

                for (var i in foundCollection.recipes) {
                    if (foundCollection.recipes[i].id)// if exist
                        recipeIds.push(foundCollection.recipes[i].id)
                }
                
                // find recipes
                RecipeService.find(req, res, next, recipeIds);

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
     * @api {delete} /collection Delete a Collection
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

    /**
     * @api {put} /collection/:collection/recipe Add a recipe to a Collection
     * @apiName AddRecipeCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per aggiungere una ricetta ad un propria collezione.
     * Bisogna essere autori della collezione.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiParam {Integer} recipe_id The id of the recipe to add.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} recipe JSON that represents the updated collection object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
		{
          "recipes": [
            {
              "title": "Carbonara senza uova",
              "description": "Procedere cosi...",
              "author": "55f8245674cb8184028877b9",
              "createdAt": "2015-09-15T14:01:17.587Z",
              "updatedAt": "2015-09-16T14:01:00.416Z",
              "id": "55f824ad74cb8184028877ba"
            },
            {
              "title": "Insalata gustosa",
              "description": "...",
              "author": "55f8245674cb8184028877b9",
              "createdAt": "2015-09-16T13:47:06.431Z",
              "updatedAt": "2015-09-16T13:59:05.017Z",
              "id": "55f972da73909ce21687036d"
            },
            {
              "title": "Pollo con le patate",
              "description": "Un classico...",
              "author": "55f8245674cb8184028877b9",
              "createdAt": "2015-09-16T14:03:22.642Z",
              "updatedAt": "2015-09-16T14:03:22.642Z",
              "id": "55f976aa38c06a6c17c84b6b"
            }
          ],
          "author": {
            "username": "cavallo",
            "createdAt": "2015-09-15T13:59:50.559Z",
            "updatedAt": "2015-09-15T13:59:50.559Z",
            "id": "55f8245674cb8184028877b9"
          },
          "title": "Ricette super fresche",
          "description": "Bla bla bla...",
          "createdAt": "2015-09-15T20:31:48.692Z",
          "updatedAt": "2015-09-16T14:03:54.654Z",
          "id": "55f8803410dc1b5d0abda199"
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
    addRecipe: function (req, res, next) {
        var recipeId = req.body.recipe_id;
        if (!recipeId) { return next(); }

        Recipe.findOne(recipeId).exec(function (err, recipe) {
            if (err) { return next(err); }

            if (!recipe) { return res.notFound({ error: 'No recipe found' }); }

            var newCollection = req.collection;
            newCollection.recipes.add(recipe.id);

            newCollection.save(function (err, saved) {
                if (err) { return next(err); }
                return res.json(saved);
            });

        });

    },

    /**
     * @api {delete} /collection/:collection/recipe Remove a recipe from a Collection
     * @apiName RemoveRecipeCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per rimuovere una ricetta da un propria collezione.
     * Per essere sicuri dell'eliminazione conviene richiedere la stessa collezione.
     * Bisogna essere autori della collezione.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiParam {Integer} recipe_id The id of the recipe to remove.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 204 No Content
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoPermissionError
     */
    removeRecipe: function (req, res, next) {
        var recipeId = req.body.recipe_id;
        if (!recipeId) { return next(); }

        var collection = req.collection;
        /*
        var idx = collection.findRecipe(recipeId);
        if(idx == -1) { return res.notFound({error: 'No recipe found in this collection'}) }
        */
        collection.recipes.remove(recipeId);
        collection.save(function (err, saved) {
            if (err) { return next(err); }
            return res.send(204, null);// OK - No Content
        });
    },

    /**
     * @api {put} /collection/:collection/follow Follow a Collection
     * @apiName FollowCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve seguire una collezione.
     * Richiede l'autenticazione della richiesta. Attenzione: non è possibile seguire se
     * stessi.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     *
     * @apiUse NoCollectionError
     */
    follow: function (req, res, next) {
        var user = req.payload;
        var collectionToFollow = req.collection;

        // ricarico l'utente corrente (con l'array dei following) (necessario...)
        User.findOne(user.id).populate('followingCollections').exec(function (err, foundUser) {
            // seguire più volte non è permesso
            if (foundUser.isFollowingCollection(collectionToFollow.id) == true) { return res.badRequest(); }

            foundUser.followingCollections.add(collectionToFollow.id);

            foundUser.save(function (err, saved) {
                if (err) { return next(err); }
                return res.send(204, null);// OK - No Content
            });
        });
    },

    /**
     * @api {delete} /collection/:collection/follow Unfollow a Collection
     * @apiName UnfollowCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve non seguire più una collezione.
     * Richiede l'autenticazione della richiesta.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoUserError
     *
     * @apiUse NoCollectionError
     */
    unfollow: function (req, res, next) {
        var user = req.payload;
        var collectionTounfollow = req.collection;

        // ricarico l'utente corrente (con l'array dei following) (necessario...)
        User.findOne(user.id).exec(function (err, foundUser) {

            foundUser.followingCollections.remove(collectionTounfollow.id);

            foundUser.save(function (err, saved) {
                if (err) { return next(err); }
                return res.send(204, null);// OK - No Content
            });
        });
    },

    /**
     * @api {get} /collection/:collection/follower List followers of a Collection
     * @apiName FollowerCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per ricavare la lista degli utenti che seguono una collezione.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     *
     * @apiUse NoCollectionError
     */
    getFollowers: function (req, res, next) {
        var collectionId = req.param('collection');
        if (!collectionId) { return next(); }

        Collection.findOne(collectionId).populate('followers').exec(function (err, foundCollection) {
            if (err) { return next(err); }
            if (!foundCollection) { return res.notFound({ error: 'No collection found' }); }
            return res.json(foundCollection.followers);
        });
    },

    /**
     * @api {get} /collection/:collection/following Check if you are following a Collection
     * @apiName AreYouFollowingCollection
     * @apiGroup Collection
     *
     * @apiDescription Serve per verificare se l'utente chiamante sta segundo una Collezione.
     * Richiede l'autenticazione della richiesta.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 No Content
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 404 Not Found
     *
     * @apiUse TokenFormatError
     *
     * @apiUse NoAuthHeaderError
     *
     * @apiUse InvalidTokenError
     *
     * @apiUse NoCollectionError
     */
    areYouFollowing: function (req, res, next) {
        var user = req.payload;
        var targetCollection = req.collection;

        // ricarico l'utente corrente (necessario...)
        User.findOne(user.id).populate('followingCollections').exec(function (err, foundUser) {
            if (err) { return next(err); }

            // seguire più volte non è permesso
            if (foundUser.isFollowingCollection(targetCollection.id) == false) { return res.notFound(); }

            return res.send(204, null);// OK - No Content
        });
    },

};

