/**
 * jwToken.js
 *
 * Servizio per generare e verificare il token, la sua visibilità
 * all'interno dell'applicazione è globale.
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */
 
var jwt = require('jsonwebtoken');

var tokenSecret = "fbaafcc2-9aee-11e6-9f33-a24fc0d9649c";
 
// Generates a token from supplied payload
module.exports.issue = function (payload) {
  return jwt.sign(
    payload,
    tokenSecret, // Token Secret that we sign it with
    {
      expiresIn : 60 * 24 * 30 * 60 // Token Expire time
    }
  );
};
 
// Verifies token on a request
module.exports.verify = function (token, callback) {
  return jwt.verify(
    token, // The token to be verified
    tokenSecret, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};
