/**
* CollectionRecipe.js
*
* @description :: Modello che serve a contenere la lista di ricette incluse in
* raccolte.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    collection : { 
      	model :'collection',
      	required : true
    },

    recipe : { 
    	model :'recipe',
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