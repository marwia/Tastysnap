/**
* Comment.js
*
* @description :: Questo modello rappresenta un commento.
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

  	body : { type: 'String', required: true },

    user : { 
    	model :'user',
      required : true
    },

    recipe : { 
      model :'recipe',
      required : true
    },
    
    // Reference to many Votes
    votes : {
      collection: 'voteComment',
      via: 'comment'
    },

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

