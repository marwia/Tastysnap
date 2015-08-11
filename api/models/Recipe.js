/**
* Recipe.js
*
* @description :: Rappresenta una generica ricetta che ogni utente può creare.
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

    title : { type: 'String' },

    description : { type: 'String' },

    ingredients : { type: 'String' },

    // Reference to User
    author : { 
      model :'user' 
    },

    //TODO: da cambiare...
    upvotes : { type: 'Integer', defaultsTo: 0},

    // Reference to many Comments
    comments : {
      collection: 'comment',
      via: 'recipeOwner'
    },

    // Reference to many Collections
    collections : {
      collection: 'collection',
      via: 'recipes'
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

