/**
 * attachUser.js
 *
 * Questa è una politica simile a quella attuata nel file 'isAuthorized.js' ma questa si occupa solo
 * di ricavare i dettagli dell'utente se è stato aggiunto il token, altrimenti procede senza
 * i dati dell'utente (come se nulla fosse successo).
 * Consiste nell'aggiungere l'utente alla richiesta.
 *
 * @description :: Policy to check if user has sent the JSON web token.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
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
      return next();// proseguo comunque senza token
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return next();// proseguo comunque senza token
  }
  
  // verifico il token (se presente), una volta che questo è stato verificato
  // ottengo il token decodificato, ovvero il payload da cui il token è stato generato
  jwToken.verify(token, function (err, decoded) {
    if (err) return next();
    req.payload = decoded; // This is the decrypted token or the payload you provided
    // ATTENZIONE: Decoded (per come è fatta la procedura di login) rappresenta 
    // l'oggetto 'User'.
    next();// utente trovato!
  });
};