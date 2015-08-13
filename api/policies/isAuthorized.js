/**
 * isAuthorized.js
 *
 * Questa è una politica di autorizzazione che viene attuata a particolari end point 
 * dell'applicazione.
 * Consiste nel verificare il token.
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

/**
 * @apiDefine TokenFormatError
 *
 * @apiError WrongTokenFormat Format is 'Authorization: Bearer [token]'
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Bad Request
 *     {
 *       "error": "WrongTokenFormat"
 *     }
 */

 /**
 * @apiDefine NoAuthHeaderError
 *
 * @apiError NoAuthHeader No Authorization header was found
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Bad Request
 *     {
 *       "error": "NoAuthHeader"
 *     }
 */

 /**
 * @apiDefine InvalidTokenError
 *
 * @apiError InvalidToken Invalid Token!
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Bad Request
 *     {
 *       "error": "InvalidToken"
 *     }
 */
module.exports = function (req, res, next) {
  var token;
 
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];
 
      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, {error: 'Format is Authorization: Bearer [token]'});
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, {error: 'No Authorization header was found'});
  }
  
  // verifico il token (se presente), una volta che questo è stato verificato
  // ottengo il token decodificato, ovvero il payload da cui il token è stato generato
  jwToken.verify(token, function (err, decoded) {
    if (err) return res.json(401, {error: 'Invalid Token!'});
    req.payload = decoded; // This is the decrypted token or the payload you provided
    // ATTENZIONE: Dedoded (per come è fatta la procedura di login) rappresenta 
    // l'oggetto 'User'.
    next();
  });
};