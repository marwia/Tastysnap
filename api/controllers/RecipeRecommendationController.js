/**
 * RecipeRecommendationController
 *
 * @description :: Server-side logic for managing Recipes recommendations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var raccoon = require('raccoon');

module.exports = {

    /**
     * @api {get} /recipe/recommendation List Recommended Recipes
     * @apiName ListRecommendedRecipes
     * @apiGroup Recipe
     *
     * @apiDescription Serve per richiedere un lista di ricette consigliate ad
     * un utente loggato.
     * 
     * @apiParam {Integer} numberOfRecs The number of records to recommend.
     *
     */
    recommendFor: function (req, res, next) {
        if (process.env.NODE_ENV != 'production') {
            return res.notFound({ error: 'No recommendation in debug mode' });
        }
        var user = req.payload;

        var numberOfRecs = req.param('numberOfRecs') ? req.param('numberOfRecs') : 8;

        raccoon.recommendFor(user.id, numberOfRecs, function (results) {

            if (results.length == 0)
                return res.notFound({ error: 'No recipe found' });

            // find recipes
            RecipeService.find(req, res, next, results);
        });
    },

    /**
     * @api {get} /user/most_similar List Most Simlar Users
     * @apiName ListMostSimilarUsers
     * @apiGroup Recipe
     *
     * @apiDescription Serve per richiedere un lista di utenti simili ad
     * un utente loggato.
     *
     */
    mostSimilarUsers: function (req, res, next) {
        if (process.env.NODE_ENV != 'production') {
            return res.notFound({ error: 'No recommendation in debug mode' });
        }

        var user = req.payload;

        raccoon.mostSimilarUsers(user.id, function (results) {

            if (results.length == 0)
                return res.notFound({ error: 'No most similar user found' });

            // find Users
            UserService.find(req, res, next, results);  
        });
    },

    /**
     * @api {get} /user/least_similar List Least Simlar Users
     * @apiName ListLeastSimilarUsers
     * @apiGroup Recipe
     *
     * @apiDescription Serve per richiedere un lista di utenti totalmente diversi ad
     * un utente loggato.
     *
     */
    leastSimilarUsers: function (req, res, next) {
        if (process.env.NODE_ENV != 'production') {
            return res.notFound({ error: 'No recommendation in debug mode' });
        }
        
        var user = req.payload;

        raccoon.leastSimilarUsers(user.id, function (results) {

            if (results.length == 0)
                return res.notFound({ error: 'No least similar user found' });

            // find Users
            UserService.find(req, res, next, results);  
        });
    }
}