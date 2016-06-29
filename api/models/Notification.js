/**
* Notification.js
*
* @description :: Questo modello rappresenta una notifica.
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

    // id dell'elemento riferito alla notifica (commento, ricetta, follow)  
  	body : { type: 'String', required: true },
    // tipo dell'elemento riferito alla notifica (ovvero il model)
    type : { type: 'String', required: true },

    // indica se la notifica è stata letta
    red : {type: 'Boolean', defaultsTo: false},

    triggeringUser : { 
    	model :'user',
      required : true
    },

    affectedUser : { 
    	model :'user',
      required : true
    },

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

