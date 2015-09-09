/**
* VoteRecipe.js
*
* @description :: Questo modello rappresenta un voto (positivo o negativo)
* che un utente iscritto può assegnare a qualsiasi ricetta.
* Il valore del voto può assumere valori: +1 e -1.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	value : { type: 'Integer' },

    author : { 
    	model :'user' 
    },

    recipe : { 
      model :'recipe' 
    }

  },

  connection: 'someMongodbServer'
};

