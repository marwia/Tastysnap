/**
* IngredientGroup.js
*
* @description :: Rappresenta un insieme di ingredienti con un nome associato, serve
*                 per poter raggruppare degli ingredienti in base al loro utilizzo.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	name : { type: 'String', required: true },

  	// Reference to Recipe
    recipe : { 
      model :'Recipe',
      required : true
    },

  	// Reference to many Ingredients
    ingredients : {
      collection: 'Ingredient',
      via: 'ingredientGroup'
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

