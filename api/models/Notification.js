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

  beforeValidate: function (values, cb) {
    if (process.env.NODE_ENV === 'production') {
      if (values.triggeringUser == values.affectedUser) {
        cb('Triggering user and affected user are the same!');
      }
      else {
        cb();
      }
    } else {
      cb();
    }
  },

  afterCreate: function (values, cb) {

    var populates = {
      populateTriggeringUser: function (cb) {
        User.findOne(values.triggeringUser).exec(function (err, result) {
          cb(err, result);
        });
      },
      populateEvent: function (cb) {
        sails.models[values.type.toLowerCase()].findOne(values.event).exec(function (err, result) {
          cb(err, result);
        });
      }
    };

    // eseguo lo precedenti funzioni in parallelo
    async.parallel(populates, function (err, resultSet) {
      if (err) { return next(err); }

      // copio i valori calcolati
      values.triggeringUser = resultSet.populateTriggeringUser;
      values.event = resultSet.populateEvent;

      // richiamo la callback finale
      // spedisco la notifica
      User.message(values.affectedUser, values);
    });

    cb();
  },
  /***************************************************************************
  *                                                                          *
  * Metodi della classe (una sorta di metodi statici in Java).               *
  *                                                                          *
  ***************************************************************************/

  /**
   * Notifica un evento ai followers di un utente.
   * @param {User} user Utente preso in esame
   * @param {Object} event Evento da notificare
   * @param {String} eventType Nome dell'evento o del modello che lo rappresenta
   */
  notifyUserFollowers: function (user, event, eventType) {
    FollowUser.find({ following: user.id }).exec(function (err, followers) {
      if (!err) {
        followers.forEach(function (follower) {

          Notification.create({
            event: event.id,
            type: eventType,
            red: false,
            triggeringUser: user.id,
            affectedUser: follower.follower
          }).exec(function (err, createdNotification) {
            if (err) console.log(err);

          });
        }, this);
      }
    });
  },

  /**
   * Notifica un evento ai followers di una raccolta.
   * @param {Collection} collection Raccolta presa in esame
   * @param {Object} event Evento da notificare
   * @param {String} eventType Nome dell'evento o del modello che lo rappresenta
   */
  notifyCollectionFollowers: function (collection, event, eventType) {
    FollowCollection.find({ collection: collection.id }).exec(function (err, followers) {
      if (!err) {
        followers.forEach(function (follower) {

          Notification.create({
            event: event.id,
            type: eventType,
            red: false,
            triggeringUser: collection.author,
            affectedUser: follower.user
          }).exec(function (err, createdNotification) {
            if (err) console.log(err);

          });
        }, this);
      }
    });
  },

  /**
   * Notifica un evento ad un utente soltanto
   * @param {String} triggeringUser L'utente che crea la notifica
   * @param {String} affectedUser L'utente che subisce la notifica
   * @param {Object} event Evento da notificare
   * @param {String} eventType Nome dell'evento o del modello che lo rappresenta
   */
  notifyUser: function (triggeringUser, affectedUser, event, eventType) {

    Notification.create({
      event: event.id,
      type: eventType,
      red: false,
      triggeringUser: triggeringUser,
      affectedUser: affectedUser
    }).exec(function (err, createdNotification) {
      if (err) console.log(err);

    });
  },

  /***************************************************************************
  *                                                                          *
  * Nome dell'interfaccia di connessione al database relativo                *
  * a questo modello.                                                        *
  *                                                                          *
  ***************************************************************************/
  connection: 'someMongodbServer'
};

