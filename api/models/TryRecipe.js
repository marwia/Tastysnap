/**
* TryRecipe.js
*
* @description :: Modello che serve per tenere traccia delle prove di
* ricette (cioè segnalare quali ricette sono state provate).
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    
    user : { 
    	  model :'user',
    	  required : true
    },

    recipe : { 
      	model :'recipe',
      	required : true
    },
    
    // Reference to many Ingredients
  	// Because a product can become an ingredient many times
    details : {
      collection: 'TryRecipeDetail',
      via: 'trial'
    }

  }
};

