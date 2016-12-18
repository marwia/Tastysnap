/**
 * StaticController
 *
 * @description :: Server-side logic for managing Statics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var getBaseUrl = function(req) {
    var protocol = req.connection.encrypted?'https':'http';
    var baseUrl = protocol + '://' + req.headers.host;
    return baseUrl;
}

var defaults = {
    title: 'Tastysnap',
    description: 'Immergiti nel fantastico mondo della cucina e fatti ispirare da altri utenti provenienti da ogni parte del mondo.',
    imageUrl: '/app_images/tasty_header.jpg'
}

module.exports = {

    /**
    * @api {get} /static/app/recipe/:recipe Serve a Recipe content
    * @apiName StaticContent
    * @apiGroup Recipe
    *
    * @apiDescription Serve per servire pagine statiche ai scraper
    * dei social network. In questo caso viene usato per le ricette.
    *
    */
    recipe: function (req, res, next) {
        var recipeId = req.param('recipe');
        if (!recipeId) { return next(); }

        Recipe.findOne(recipeId)
            .populate('steps')
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (!foundUser) { return res.notFound({ error: 'No recipe found' }); }

                return res.view('static',
                    {
                        title: foundUser.title,
                        description: foundUser.steps[0].description,
                        imageUrl: foundUser.coverImageUrl,
                        url: getBaseUrl(req) + '/app/recipe/' + foundUser.id,
                        layout: false
                    });
            });
    },

    /**
     * @api {get} /static/app/collection/:collection Serve a Collection content
     * @apiName StaticContent
     * @apiGroup Collection
     *
     * @apiDescription Serve per servire pagine statiche ai scraper
     * dei social network. In questo caso viene usato per le raccolte.
     *
     */
    collection: function (req, res, next) {
        var collectionId = req.param('collection');
        if (!collectionId) { return next(); }

        Collection.findOne(collectionId)
            .exec(function (err, foundCollection) {

                if (err) { return next(err); }

                if (!foundCollection) { return res.notFound({ error: 'No collection found' }); }

                // Se non vi è una copertina impostata devo
                // caricare una ricetta della raccolta e mostrare
                // la sua immagine come copertina della raccolta.
                if (foundCollection.coverImageUrl == 'undefined'
                    || foundCollection.coverImageUrl == null) {
                    CollectionRecipe.findOne({
                        collection: foundCollection.id
                    })
                        .populate('recipe')
                        .exec(function (err2, foundCollectionRecipe) {
                            if (err2) { return next(err2); }

                            // Raccolta senza ricette
                            if (!foundCollectionRecipe) {
                                return res.view('static',
                                    {
                                        title: foundCollection.title,
                                        description: foundCollection.description,
                                        imageUrl: foundCollection.coverImageUrl,
                                        url: getBaseUrl(req) + '/app/collection/' + foundCollection.id,
                                        layout: false
                                    });
                            }

                            // Raccolta con almeno una immagine
                            return res.view('static',
                                {
                                    title: foundCollection.title,
                                    description: foundCollection.description,
                                    imageUrl: foundCollectionRecipe.recipe.coverImageUrl,
                                    url: getBaseUrl(req) + '/app/collection/' + foundCollection.id,
                                    layout: false
                                });
                        });

                    // La copertina è già presente
                } else return res.view('static',
                    {
                        title: foundCollection.title,
                        description: foundCollection.description,
                        imageUrl: foundCollection.coverImageUrl,
                        url: getBaseUrl(req) + '/app/collection/' + foundCollection.id,
                        layout: false
                    });


            });
    },

     /**
    * @api {get} /static/app/profile/:user Serve a Profile content
    * @apiName StaticContent
    * @apiGroup Profile
    *
    * @apiDescription Serve per servire pagine statiche ai scraper
    * dei social network. In questo caso viene usato per i profili.
    *
    */
    profile: function (req, res, next) {
        var userId = req.param('user');
        if (!userId) { return next(); }

        User.findOne(userId)
            .exec(function (err, foundUser) {
                if (err) { return next(err); }

                if (!foundUser) { return res.notFound({ error: 'No user found' }); }

                return res.view('static',
                    {
                        title: foundUser.name + ' ' + foundUser.surname,
                        description: defaults.description,
                        imageUrl: foundUser.coverImageUrl,
                        url: getBaseUrl(req) + '/app/profile/' + foundUser.id,
                        layout: false
                    });
            });
    },

    default: function (req, res, next) {
        var new_url = getBaseUrl(req) + req.url.replace('static/', '');

        return res.view('static',
        {
            title: defaults.title,
            description: defaults.description,
            imageUrl: getBaseUrl(req) + defaults.imageUrl,
            url: new_url,
            layout: false
        });
    }

};

