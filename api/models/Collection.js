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

  	// Count value
  	recipesNumber : { type: 'Integer' },

  	// Count value
  	followersNumber : { type: 'Integer' },

  	// Count value
  	viewsNumber : { type: 'Integer' },

  	// Reference to User
  	author : { 
    	model :'user' 
    },

  	// Reference to many Recipes
    recipes : {
        collection: 'recipe',
        via: 'collections'
    },

    upvote : function( callback ) {
      this.upvotes += 1;
      this.save(callback);
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

