/**
* ViewCollection.js
*
* @description :: Modello che serve a registrare le visualizzazione di raccolte da parte degli utenti.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user : { 
    	model :'user',
    	required : true
    },

    collection : { 
      	model :'collection',
      	required : true
    }

  }
};
