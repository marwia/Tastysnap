/**
* Notification.js
*
* @description :: Questo modello rappresenta una notifica.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  /***************************************************************************
  *                                                                          *
  * Attributi e metodi d'istanza, ovvero oggetti che vengono creati ogni     *
  * volta che viene creato un oggetto di questa classe.                      *
  *                                                                          *
  ***************************************************************************/
  attributes: {

    // id dell'elemento riferito alla notifica (commento, ricetta, follow)  
    event: { type: 'String', required: true },
    // tipo dell'elemento riferito alla notifica (ovvero il model)
    type: { type: 'String', required: true },

    // indica se la notifica è stata letta
    red: { type: 'Boolean', defaultsTo: false },

    triggeringUser: {
      model: 'user',
      required: true
    },

    affectedUser: {
      model: 'user',
      required: true
    },

  },

  afterCreate: function (values, cb) {
    // spedisco la notifica
    //sails.sockets.blast(values);

    /**
     * Ricavo gli id delle socket che l'utente
     * destinatario possa aver creato.
     */
    ConnectedUser.find({
      user: values.affectedUser
    }).exec(function (err, connectedUsers) {
      if (err) { 
        console.log(err);
        cb();
      }

      connectedUsers.forEach(function (element) {
        // spedisco la notifica
        console.log("spedisco la notifica");
        ConnectedUser.message(element.id, values);
      });

      // Continua...
      cb();
    });

    sails.sockets.blast(values);
  },
  /***************************************************************************
  *                                                                          *
  * Metodi della classe (una sorta di metodi statici in Java).               *
  *                                                                          *
  ***************************************************************************/

  /***************************************************************************
  *                                                                          *
  * Nome dell'interfaccia di connessione al database relativo                *
  * a questo modello.                                                        *
  *                                                                          *
  ***************************************************************************/
  connection: 'someMongodbServer'
};

