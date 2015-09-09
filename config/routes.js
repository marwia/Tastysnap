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

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

 /**
  * Entry point dell'app AngularJS.
  * E' importante specificare che si tratta di una GET altrimenti
  * ogni richiesta verrà reinderizzata qui.
  */
  'get /': {
    view: 'index'
  },

  /*

  'get /:something': {
       target: '/',
       skipAssets: true
  },

  'get /:something/*': {
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

  /***************************************************************************
  *                                                                          *
  * Voti a ricette.                                                          *
  *                                                                          *
  ***************************************************************************/

  'post /api/v1/recipe/:recipe/upvote': 'VoteRecipeController.createUpvote',

  'post /api/v1/recipe/:recipe/downvote': 'VoteRecipeController.createDownvote',

  'delete /api/v1/recipe/:recipe/vote': 'VoteRecipeController.destroy',

  'get /api/v1/recipe/:recipe/upvotes': 'VoteRecipeController.findUpvotes',

  'get /api/v1/recipe/:recipe/downvotes': 'VoteRecipeController.findDownvotes',

  'get /api/v1/recipe/:recipe/vote': 'VoteRecipeController.checkVote',

  'get /api/v1/post/:post': 'PostController.getPost',

  'put /api/v1/post/:post/upvote': 'PostController.upvote',

  'post /api/v1/post/create': 'PostController.create',

  'post /api/v1/post/:post/comment': 'CommentController.create',

  'put /api/v1/post/:post/comment/:comment/upvote': 'CommentController.upvote',

  'post /api/v1/login': 'AuthController.index'

};
