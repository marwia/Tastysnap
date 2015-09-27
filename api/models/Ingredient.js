/**
* Ingredient.js
*
* @description :: Rappresenta un prodotto che è stato usato in una ricetta.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	quantity : { type: 'Float', required: true },

  	unitOfMeasue : { 
  		type: 'String', 
  		required: true,
  		enum: ['kg', 'hg', 'dg', 'g', 'mg',
  			'l', 'dl', 'cl', 'ml',
  			'drop', 'pinch', 'teaspoon', 'tablespoon', 'cup']
  	},

  	// Reference to Product
    product : { 
      model :'Product',
      required : true
    },

    // Reference to Ingredient Group
    ingredientGroup : { 
      model :'IngredientGroup',
      required : true
    }

  }
};

