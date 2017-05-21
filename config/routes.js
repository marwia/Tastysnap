/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

var blueprintConfig = require('./blueprints');

var ROUTE_PREFIX = blueprintConfig.blueprints.prefix || "";

// add global prefix to manually defined routes
// Exclude the first one
function addGlobalPrefix(routes) {
    var paths = Object.keys(routes),
        newRoutes = {};

    if (ROUTE_PREFIX === "") {
        return routes;
    }

    var i = 0;
    paths.forEach(function(path) {

        var pathParts = path.split(" "),
            uri = pathParts.pop(),
            prefixedURI = "", newPath = "";

        prefixedURI = ROUTE_PREFIX + uri;

        pathParts.push(prefixedURI);

        newPath = pathParts.join(" ");
        // construct the new routes
        newRoutes[newPath] = routes[path];
        i++;
    });

    return newRoutes;
};

var viewRoutes = {
    /**
    * Entry point dell'app AngularJS.
    * E' importante specificare che si tratta di una GET altrimenti
    * ogni richiesta verrà reinderizzata qui.
     * ATTENZIONE è STATA ESCLUSA DALL'AGGIUNGERE IL PREFISSO
     */
    'get /': {
        view: 'index'
    },
    
    'get /info': {
        view: 'informazioni',
        locals: {
            title: "Informazioni",
            layout: 'static_layout'
        }
    },

    'get /terms': {
        view: 'termini_di_servizio',
        locals: {
            title: "Termini di servizio",
            layout: 'static_layout'
        }
    },
    
    'get /privacy': {
        view: 'privacy',
        locals: {
            title: "Privacy policy",
            layout: 'static_layout'
        }
    },
    
    'get /cookie': {
        view: 'cookie',
        locals: {
            title: 'Cookie policy',
            layout: 'static_layout'
        }
    },

    'get /admin': {
        view: 'admin',
        locals: {
            layout: false
        }
    },

    'get /admin/*': {
        view: 'admin',
        locals: {
            layout: false
        }
    },

    'get /about': {
        view: 'about',
        locals: {
            layout: false
        }
    },

    /**
     * Gestione di pagine statiche per i web scrapers.
     */

    'get /static/app/recipe/:recipe': 'StaticController.recipe',
    'get /static/app/collection/:collection': 'StaticController.collection',
    'get /static/app/profile/:user': 'StaticController.profile',
    'get /static/app/profile/:user/:type': 'StaticController.profile',

    // Defaults for app
    'get /static/login': 'StaticController.default',
    'get /static/about': 'StaticController.default',
    'get /static/app/home/:type': 'StaticController.default',
    'get /static/app/near_recipes': 'StaticController.default',
    'get /static/app/activites': 'StaticController.default',
    'get /static/app/viewed_recipes': 'StaticController.default',
    'get /static/app/favorite_recipes': 'StaticController.default',
    'get /static/app/followed_collections': 'StaticController.default',
    'get /static/app/tasted_recipes': 'StaticController.default',

    // Other defaults
    'get /static/info': 'StaticController.default',
    'get /static/terms': 'StaticController.default',
    'get /static/privacy': 'StaticController.default',
    'get /static/cookie': 'StaticController.default',
}


var apiRoutes = addGlobalPrefix({

    /***************************************************************************
    *                                                                          *
    * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
    * etc. depending on your default view engine) your home page.              *
    *                                                                          *
    * (Alternatively, remove this and add an `index.html` file in your         *
    * `assets` directory)                                                      *
    *                                                                          *
    ***************************************************************************/



    /*
    'get /:something': {
         target: '/',
         skipAssets: true
    },
    
    'get /:something/:weft': {
          target: '/',
          skipAssets: true
    },
    */

    /***************************************************************************
    *                                                                          *
    * Custom routes here...                                                    *
    *                                                                          *
    *  If a request to a URL doesn't match any of the custom routes above, it  *
    * is matched against Sails route blueprints. See `config/blueprints.js`    *
    * for configuration options and examples.                                  *
    *                                                                          *
    ***************************************************************************/

    'post /contact': 'FormContactController.contact',

    /***************************************************************************
    *                                                                          *
    * Utenti                                                                   *
    *                                                                          *
    ***************************************************************************/

    'get /auth/facebook': 'AuthController.facebook',

    'get /auth/facebook/callback': 'AuthController.facebookCallback',

    'get /auth/google': 'AuthController.google',

    'get /auth/google/callback': 'AuthController.googleCallback',

    'get /auth/twitter': 'AuthController.twitter',

    'get /auth/twitter/callback': 'AuthController.twitterCallback',

    'put /user/:user/follow': 'FollowUserController.create',

    'delete /user/:user/follow': 'FollowUserController.destroy',

    'get /user/:user/follower': 'FollowUserController.getFollowers',

    'get /user/:user/following': 'FollowUserController.getFollowing',

    'get /user/following/:user': 'FollowUserController.areYouFollowing',

    'get /user/:user/following/:target_user': 'FollowUserController.isFollowing',

    'get /user/:id/upvoted_recipe': 'UserController.findUserUpvotedRecipes',

    'get /user/:id/viewed_recipe': 'UserController.findUserViewedRecipes',

    'get /user/:id/tried_recipe': 'UserController.findUserTriedRecipes',

    'get /user/:id/following_collections': 'FollowCollectionController.findUserFollwingCollections',
    
    'put /user/:user/upload_cover_image': 'UserController.uploadCoverImage',

    'get /user/last_seen': 'UserController.getLastSeen',

    'post /user/notification/register': 'UserController.registerToNotifications',

    'put /user/:id': 'UserController.update',

    /***************************************************************************
    *                                                                          *
    * Ricette.                                                                 *
    *                                                                          *
    ***************************************************************************/

    // definisco solo le azioni non standard

    'put /recipe/:recipe/upload_cover_image': 'RecipeController.uploadCoverImage',

    'put /recipe/:recipe/upload_blurred_cover_image': 'RecipeController.uploadBlurredCoverImage',

    'put /recipe/:recipe/upload_image': 'RecipeController.uploadImage',

    'get /recipe/categories': 'RecipeController.getRecipeCategories',

    'get /recipe/dosage_types': 'RecipeController.getRecipeDosageTypes',
    
    'get /recipe/search': 'RecipeController.advancedSearch',
    
    'get /recipe/search/coordinates': 'RecipeController.searchByCoordinates',

    'put /recipe/:recipe/:ingredientState': 'RecipeController.changeIngredientState',

    /***************************************************************************
    *                                                                          *
    * Passi di ricette.                                                        *
    *                                                                          *
    ***************************************************************************/

    'post /recipe/:recipe/step': 'RecipeStepController.create',

    'delete /recipe/:recipe/step/:step': 'RecipeStepController.destroy',

    'get /recipe/:recipe/step': 'RecipeStepController.findSteps',

    'put /recipe/:recipe/step/:step': 'RecipeStepController.update',

    /***************************************************************************
    *                                                                          *
    * Voti a ricette.                                                          *
    *                                                                          *
    ***************************************************************************/

    'post /recipe/:recipe/upvote': 'VoteRecipeController.createUpvote',

    'post /recipe/:recipe/downvote': 'VoteRecipeController.createDownvote',

    'delete /recipe/:recipe/vote': 'VoteRecipeController.destroy',

    'get /recipe/:recipe/upvote': 'VoteRecipeController.findUpvotes',

    'get /recipe/:recipe/downvote': 'VoteRecipeController.findDownvotes',

    'get /recipe/:recipe/voted': 'VoteRecipeController.checkVote',
    
    /***************************************************************************
    *                                                                          *
    * Segnalazioni di ricette.                                                 *
    *                                                                          *
    ***************************************************************************/
    
    'post /recipe/:recipe/report': 'ReportRecipeController.create',
    
    'get /recipe/:recipe/report': 'ReportRecipeController.find',

    /***************************************************************************
    *                                                                          *
    * Prove di ricette.                                                        *
    *                                                                          *
    ***************************************************************************/

    'post /recipe/:recipe/try': 'TryRecipeController.create',

    'delete /recipe/:recipe/try': 'TryRecipeController.destroy',

    'get /recipe/:recipe/try': 'TryRecipeController.find',

    'get /recipe/:recipe/tried': 'TryRecipeController.checkTry',
    
    /***************************************************************************
    *                                                                          *
    * Recensioni di ricette.                                                   *
    *                                                                          *
    ***************************************************************************/

    'post /recipe/:recipe/review': 'ReviewRecipeController.create',

    'delete /recipe/:recipe/review/:review': 'ReviewRecipeController.destroy',

    'put /recipe/:recipe/review/:review': 'ReviewRecipeController.update',
    
    'get /recipe/:recipe/review': 'ReviewRecipeController.find',

    'get /recipe/:recipe/review/:review': 'ReviewRecipeController.findOne',
    
    'get /recipe/:recipe/reviewed': 'ReviewRecipeController.checkReview',

    'get /review/typologies': 'ReviewRecipeController.getTypologies',
    
    'get /recipe/:recipe/review/total/:typology': 'ReviewRecipeController.getTotalValueForTypology',

    /***************************************************************************
    *                                                                          *
    * View di ricette.                                                         *
    *                                                                          *
    ***************************************************************************/

    // per ora nulla...

    /***************************************************************************
    *                                                                          *
    * Commenti a ricette.                                                      *
    *                                                                          *
    ***************************************************************************/

    'post /recipe/:recipe/comment': 'CommentController.create',

    'delete /recipe/:recipe/comment/:id': 'CommentController.destroy',

    'put /recipe/:recipe/comment/:id': 'CommentController.update',

    'get /recipe/:recipe/comment': 'CommentController.find',

    'get /recipe/:recipe/comment/:id': 'CommentController.findOne',

    /***************************************************************************
    *                                                                          *
    * Voti a commenti                                                          *
    *                                                                          *
    ***************************************************************************/

    'post /comment/:comment/upvote': 'VotecommentController.createUpvote',

    'post /comment/:comment/downvote': 'VotecommentController.createDownvote',

    'delete /comment/:comment/vote': 'VotecommentController.destroy',

    'get /comment/:comment/upvote': 'VotecommentController.findUpvotes',

    'get /comment/:comment/downvote': 'VotecommentController.findDownvotes',

    'get /comment/:comment/voted': 'VotecommentController.checkVote',

    /***************************************************************************
    *                                                                          *
    * Collezioni di ricette.                                                   *
    *                                                                          *
    ***************************************************************************/

    'get /collection/:collection': 'CollectionController.findOne',

    'put /collection/:collection/recipe/:recipe': 'CollectionRecipeController.create',

    'delete /collection/:collection/recipe/:recipe': 'CollectionRecipeController.destroy',

    'get /collection/:collection/recipe': 'CollectionRecipeController.getRecipes',

    'put /collection/:collection/follow': 'FollowCollectionController.create',

    'delete /collection/:collection/follow': 'FollowCollectionController.destroy',

    'get /collection/:collection/follower': 'FollowCollectionController.getCollectionFollowers',

    'get /collection/:collection/following': 'FollowCollectionController.areYouFollowing',

    'put /collection/:collection/upload_cover_image': 'CollectionController.uploadCoverImage',

    'delete /collection/:collection/cover_image': 'CollectionController.deleteCoverImage',

    /***************************************************************************
    *                                                                          *
    * View di collection.                                                      *
    *                                                                          *
    ***************************************************************************/

    // per ora nulla...

    /***************************************************************************
    *                                                                          *
    * Ingredienti di ricette.                                                  *
    *                                                                          *
    ***************************************************************************/

    'post /recipe/:recipe/ingredient_group': 'IngredientGroupController.create',

    'put /recipe/:recipe/ingredient_group/:ingredient_group': 'IngredientGroupController.update',

    'delete /recipe/:recipe/ingredient_group/:ingredient_group': 'IngredientGroupController.destroy',


    'post /recipe/:recipe/ingredient_group/:ingredient_group/ingredient': 'IngredientController.create',

    'put /recipe/:recipe/ingredient_group/:ingredient_group/ingredient/:ingredient': 'IngredientController.update',

    'delete /recipe/:recipe/ingredient_group/:ingredient_group/ingredient/:ingredient': 'IngredientController.destroy',


    'get /ingredient/unit_of_measure': 'IngredientController.getIngredientUnitOfMeasure',

    'get /ingredientgroup/:id/ingredients': 'IngredientController.getIngredientsGroupIngredients',



    'post /ingredient/add_request': 'IngredientController.addIngredientReq',

    /***************************************************************************
    *                                                                          *
    * Prodotti                                                                 *
    *                                                                          *
    ***************************************************************************/

    'get /product/groups': 'ProductController.getProductGroups',

    /***************************************************************************
    *                                                                          *
    * Notifiche                                                                *
    *                                                                          *
    ***************************************************************************/

    'get /user/notification': 'NotificationController.find',

    'get /user/activity': 'NotificationController.findActivity',

    'put /user/notification/red': 'NotificationController.red',

    'put /user/notification/not_red': 'NotificationController.notRed',

    /***************************************************************************
    *                                                                          *
    * Consigli di ricette e persone simili                                     *
    *                                                                          *
    ***************************************************************************/

    'get /recipe/recommendation': 'RecipeRecommendationController.recommendFor',

    'get /user/most_similar': 'RecipeRecommendationController.mostSimilarUsers',

    'get /user/least_similar': 'RecipeRecommendationController.leastSimilarUsers',

    /***************************************************************************
    *                                                                          *
    * Invitation                                                               *
    *                                                                          *
    ***************************************************************************/
    
    'get /auth/invitation': 'AuthController.isInvitationRequired',

    /***************************************************************************
    *                                                                          *
    * User Permission                                                          *
    *                                                                          *
    ***************************************************************************/

    'get /auth/permission': 'UserPermissionController.findOne'


});

var paths = Object.keys(apiRoutes);

//This automatically serves all routes, apart from /api/** routes to ember
//(which will be initialized in assets/index.html). This route needs to be
//at the very bottom if you want to server other routes through Sails, because they are matched in order

/*
Credo che la regex significhi esegui questa route se non contiene la parola api ne la parola csrfToken
(ne view aggiunte in questo modo: "|^\/prova" aggiunta prima dell'ultimo "/") 
*/
apiRoutes['get *'] = { view: 'index', skipAssets: true, skipRegex: /^\/api\/.*$|csrfToken|^\/terms|^\/info|^\/cookie|^\/privacy|^\/about|^\/admin|^\/static/};

// ritorno il merge dei due oggetti contenenti routes
var extend = require('util')._extend
module.exports.routes = extend(apiRoutes, viewRoutes);
