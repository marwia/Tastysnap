/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP request. (the Sails *
    * router is invoked by the "router" middleware below.)                     *
    *                                                                          *
    ***************************************************************************/

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
      'serverSideRender',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

    /****************************************************************************
    *                                                                           *
    * Example custom middleware; logs each request to the console.              *
    *                                                                           *
    ****************************************************************************/

    /**
     * Middleware che si occupa di loggare le richieste.
     */
    myRequestLogger: function (req, res, next) {
      console.log("Requested :: ", req.method, req.url);
      //console.log(req.headers);
      return next();
    },

    /**
     * Middleware usato per gestire le richieste da parte di scraper di
     * vari social network ecc..
     */
    serverSideRender: function (req, res, next) {
      
      // se non si tratta di una richiesta già static allora procedo
      if (new RegExp('^\/static|^\/app_images|^\/about_assets').test(req.url) == false) {
        var user_agent = req.headers['user-agent'];

        // se si tratta di un scraper (crawler) allora lo reinderizzo su 
        // una pagina statica corrispondente a quella richiesta
        if (new RegExp('facebookexternalhit\/[0-9]|Twitterbot|Pinterest|Google.*snippet|WhatsApp\/[0-9]').test(user_agent)) {
          return res.redirect('/static' + req.url);
        }
      }

      return next();
    },


    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests. By    *
    * default as of v0.10, Sails uses                                          *
    * [skipper](http://github.com/balderdashy/skipper). See                    *
    * http://www.senchalabs.org/connect/multipart.html for other options.      *
    *                                                                          *
    ***************************************************************************/

    //bodyParser: require('skipper')

  },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  cache: 2592000000 // 30 giorni
};
