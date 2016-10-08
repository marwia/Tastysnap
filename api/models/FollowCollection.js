/**
* FollowCollection.js
*
* @description :: Modello che serve a registrare l'azione di seguire le raccolte da parte degli utenti.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // Coordinate in geoJSON attribuite al momento della creazione
    creationCoordinates: { type: 'json' },

    collection : { 
      	model :'collection',
      	required : true
    },

    user : { 
    	model :'user',
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
