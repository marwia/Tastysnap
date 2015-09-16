/**
* Collection.js
*
* @description :: Questo modello rappresenta una raccolta di ricette.
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

  	title : { type: 'String', required: true },

  	description : { type: 'String' },

  	// Reference to User
  	author : { 
    	model :'user',
      required : true
    },

  	// Reference to many Recipes
    recipes : {
        collection: 'recipe',
        via: 'collections'
    }

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

