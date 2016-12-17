/**
 * StaticController
 *
 * @description :: Server-side logic for managing Statics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
        var collectionId = req.param('recipe');
        if (!collectionId) { return next(); }

        Recipe.findOne(collectionId)
            .populate('steps')
            .exec(function (err, foundRecipe) {
                if (err) { return next(err); }

                if (!foundRecipe) { return res.notFound({ error: 'No recipe found' }); }

                return res.view('static',
                    {
                        title: foundRecipe.title,
                        description: foundRecipe.steps[0].description,
                        imageUrl: foundRecipe.coverImageUrl,
                        url: 'https://www.tastysnap/app/recipe/' + foundRecipe.id,
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
                                        url: 'https://www.tastysnap/app/collection/' + foundCollection.id,
                                        layout: false
                                    });
                            }

                            // Raccolta con almeno una immagine
                            return res.view('static',
                                {
                                    title: foundCollection.title,
                                    description: foundCollection.description,
                                    imageUrl: foundCollectionRecipe.recipe.coverImageUrl,
                                    url: 'https://www.tastysnap/app/collection/' + foundCollection.id,
                                    layout: false
                                });
                        });

                    // La copertina è già presente
                } else return res.view('static',
                    {
                        title: foundCollection.title,
                        description: foundCollection.description,
                        imageUrl: foundCollection.coverImageUrl,
                        url: 'https://www.tastysnap/app/collection/' + foundCollection.id,
                        layout: false
                    });


            });
    }

};

