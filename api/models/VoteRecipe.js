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

  	value : { type: 'Integer', required: true },

    // Coordinate in geoJSON attribuite al momento della creazione
    creationCoordinates: { type: 'json' },

    author : { 
    	model :'user',
      required: true
    },

    recipe : { 
      model :'recipe',
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

