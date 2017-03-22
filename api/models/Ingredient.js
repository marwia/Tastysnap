/**
* Ingredient.js
*
* @description :: Rappresenta un prodotto che è stato usato in una ricetta.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	quantity : { type: 'Float', required: false },// non è richiesto in caso di 'pinch' o 'enough'

  	unitOfMeasure : { 
  		type: 'String', 
  		required: true,
  		enum: ['kg', 'hg', 'dg', 'g', 'mg',
  			'l', 'dl', 'cl', 'ml',
        'pinch', 'tablespoon', 'enough'
             /*,'drop', 'pinch', 'teaspoon', 'tablespoon', 'cup'*/]// disabilitate per motivi tecnici
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

  },
  
   /***************************************************************************
  *                                                                          *
  * Nome dell'interfaccia di connessione al database relativo                *
  * a questo modello.                                                        *
  *                                                                          *
  ***************************************************************************/
  connection: 'someMongodbServer'
};

