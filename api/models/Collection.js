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

    isPrivate : { type: 'Boolean', default: false},

  	// Reference to User
  	author : { 
    	  model :'user',
        required : true
    },

    // Url which represents the main image of the collection (can be null)
    coverImageUrl : { type: 'String', url: true },

  	// Reference to many Recipes
    recipes : {
        collection: 'CollectionRecipe',
        via: 'collection'
    },

    // Reference to many Users
    followers : {
        collection: 'FollowCollection',
        via: 'collection'
    },
    
    // Reference to many Views
    views : {
        collection: 'ViewCollection',
        via: 'collection'
    },

    findRecipe : function (recipeId) {
      for (var i = 0; i < this.recipes.length; i++) {
        if(this.recipes[i].id == recipeId)
          return i;
      };
      return -1;
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

