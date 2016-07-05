/**
* ViewRecipe.js
*
* @description :: Modello che serve a registrare le visualizzazione di ricette da parte degli utenti.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user : { 
    	model :'user',
    	required : true
    },

    recipe : { 
      	model :'recipe',
      	required : true
    }

  },

  // Lifecycle Callbacks
  afterCreate: function (values, cb) {
    // spedisco a tutti
    sails.sockets.blast(values);
  },
  
   /***************************************************************************
  *                                                                          *
  * Nome dell'interfaccia di connessione al database relativo                *
  * a questo modello.                                                        *
  *                                                                          *
  ***************************************************************************/
  connection: 'someMongodbServer'
};

