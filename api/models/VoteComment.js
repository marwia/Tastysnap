/**
* VoteComment.js
*
* @description :: Questo modello rappresenta un voto (positivo o negativo)
* che un utente iscritto può assegnare a commento.
* Il valore del voto può assumere valori: +1 e -1.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	value : { type: 'Integer' },

    author : { 
    	model :'user' 
    },

    comment : { 
        model :'comment' 
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

