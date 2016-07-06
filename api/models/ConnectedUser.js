/**
* ConnectedUser.js
*
* @description :: Modello che serve a registrare gli utenti connessi.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    socketId: 'string',

    user: {
      model: 'user',
      required: true
    }

  },

 /***************************************************************************
 *                                                                          *
 * Nome dell'interfaccia di connessione al database relativo                *
 * a questo modello.                                                        *
 *                                                                          *
 ***************************************************************************/
  connection: 'someMongodbServer'
};

