/**
* ViewRecipe.js
*
* @description :: Modello che serve a registrare le visualizzazione di ricette da parte degli utenti.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user: {
      model: 'user',
      required: true
    },

    recipe: {
      model: 'recipe',
      required: true
    }

  },

  // Lifecycle Callbacks
  afterCreate: function (values, cb) {
    // trovo l'utente affetto dalla notifica
    Recipe.findOne(values.recipe).exec(function (err, foundRecipe) {
      if (err) console.log(err);
      // creo la notifica
      Notification.create({
        event: values.id,
        type: 'ViewRecipe',
        red: false,
        triggeringUser: values.user,
        affectedUser: foundRecipe.author
      }).exec(function (err, createdNotification) {
        if (err) console.log(err);
      });
    })

    // spedisco a tutti
    //sails.sockets.blast(values);
  },

  /***************************************************************************
 *                                                                          *
 * Nome dell'interfaccia di connessione al database relativo                *
 * a questo modello.                                                        *
 *                                                                          *
 ***************************************************************************/
  connection: 'someMongodbServer'
};

