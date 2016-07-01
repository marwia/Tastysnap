/**
* FollowUser.js
*
* @description :: Modello che serve a registrare l'azione di seguire gli utenti 
* da parte degli utenti stessi.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    following : { 
      	model :'user',
      	required : true
    },

    follower : { 
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