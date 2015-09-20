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
        collection: 'Recipe',
        via: 'collections'
    },

    // Reference to many Users
    followers : {
      collection: 'User',
      via: 'followingCollections'
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

