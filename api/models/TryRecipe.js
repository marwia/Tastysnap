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
    
    // Reference to many Trial Details
    details : {
      collection: 'TryRecipeDetail',
      via: 'trial'
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

