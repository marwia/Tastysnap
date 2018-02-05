/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


/**
 * Module dependencies
 */
var jwt = require('jsonwebtoken');// per l'autenticazione basata su token JSON


module.exports = {

  /***************************************************************************
  *                                                                          *
  * Attributi e metodi d'istanza, ovvero oggetti che vengono creati ogni     *
  * volta che viene creato un oggetto di questa classe.                      *
  *                                                                          *
  ***************************************************************************/
  attributes: {
    
    name : { type: 'String' },
    
    surname : { type: 'String' },
    
    email: { type: 'String', email: true },
    
    coverImageUrl: { type: 'String', url: true },

    description: { type: 'String' },
    
    //FACEBOOK
    
    facebookId : {type: 'String' },
    
    facebookImageUrl: { type: 'String', url: true },
    
    //GOOGLE
    
    googleId : {type: 'String' },
    
    googleImageUrl: { type: 'String', url: true },
    
    //TWITTER
    
    twitterId : {type: 'String' },
    
    twitterImageUrl: { type: 'String', url: true },

    lastSeen : {type: 'Datetime'},

    // Reference to many Recipes
    recipes : {
      collection: 'Recipe',
      via: 'author'
    },

    // Reference to many Collections
    collections : {
      collection: 'Collection',
      via: 'author'
    },

    // Reference to many Users
    followers : {
      collection: 'FollowUser',
      via: 'following'
    },

    // Reference to many Users
    following : {
      collection: 'FollowUser',
      via: 'follower'
    },

    // Reference to many Collections
    followingCollections : {
      collection: 'FollowCollection',
      via: 'user'
    },
    
    // Reference to many votes of recipes
    votes : {
      collection: 'VoteRecipe',
      via: 'author'
    },
    
    // Reference to many votes of recipes
    viewedRecipes : {
      collection: 'ViewRecipe',
      via: 'user'
    },
    
    // Reference to many tried recipes
    triedRecipes : {
      collection: 'TryRecipe',
      via: 'user'
    },

    // Reference to many Products
    products : {
      collection: 'Product',
      via: 'author'
    },

    // Override toJSON method to remove password from API
    toJSON: function() {
      var obj = this.toObject();
      // delete sensible data
      delete obj.email;
      return obj;
    },

    isFollowingUser: function(userId) {
      for (var i = 0; i < this.following.length; i++) {
        if(this.following[i].id == userId) { return true; }
      };
      return false;
    },

    isFollowingCollection: function(collectionId) {
      for (var i = 0; i < this.followingCollections.length; i++) {
        if(this.followingCollections[i].id == collectionId) { return true; }
      };
      return false;
    }
 
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

