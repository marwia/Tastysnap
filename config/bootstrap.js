/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  // Ensure we have 2dsphere index on Property so GeoSpatial queries can work!
  Recipe.native(function (err, collection) {
    collection.ensureIndex({ coordinates: '2dsphere' }, function () {

      // It's very important to trigger this callack method when you are finished 
      // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
      cb();

    });
  });

  /**
 * Il motore dei consigli viene usato soltanto in produzione,
 * tanto in locale non si avrebbero dati sufficienti a dare 
 * dei consigli.
 */
  if (process.env.NODE_ENV === 'production') {
    process.env.RACCOON_REDIS_URL = sails.config.raccoon.url;
    process.env.RACCOON_REDIS_PORT = sails.config.raccoon.port;
  }
};
