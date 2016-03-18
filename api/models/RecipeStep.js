/**
* RecipeStep.js
*
* @description :: Modello che serve per tenere traccia dei passi
* della preparazione di una ricetta.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    
    // Step description
    description : { type: 'String', required: true },
    
    // Sequential number for each step
    seq_number : { type: 'Integer', required: true },

    // Related Single Recipe
    recipe : { 
      	model :'recipe',
      	required : true
    }

  }
  
};