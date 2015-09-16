/**
* Recipe.js
*
* @description :: Rappresenta una generica ricetta che ogni utente
*                 iscritto alla piattaforma può creare.
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

    title : { type: 'String', required: true },

    description : { type: 'String', required: true },

    ingredients : { type: 'String' },

    // Reference to User
    author : { 
      model :'user' 
    },

    // Reference to many Likes or Not likes
    votes : {
      collection: 'voteRecipe',
      via: 'recipe'
    },

    // Reference to many Views
    views : {
      collection: 'viewRecipe',
      via: 'recipe'
    },

    // Reference to many Comments
    comments : {
      collection: 'comment',
      via: 'recipe'
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

