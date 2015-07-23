/**
* Recipe.js
*
* @description :: Rappresenta una generica ricetta che ogni utente può creare.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title : { type: 'String' },

    description : { type: 'String' },

    ingredients : { type: 'String' },

    author : { type: 'String' },

    upvotes : { type: 'Integer', defaultsTo: 0},

    comments : {
      collection: 'comment',
      via: 'RecipeOwner'
    },

    //Metodi d'istanza
    upvote: function (callback) {
      this.upvotes += 1;
      this.save(callback);
    }

  },

  connection: 'someMongodbServer'
};

