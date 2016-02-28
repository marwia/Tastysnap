/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


/**
 * Module dependencies
 */
var bcrypt = require('bcrypt-nodejs');// per generare l'hash

var jwt = require('jsonwebtoken');// per l'autenticazione basata su token JSON


module.exports = {

  /***************************************************************************
  *                                                                          *
  * Attributi e metodi d'istanza, ovvero oggetti che vengono creati ogni     *
  * volta che viene creato un oggetto di questa classe.                      *
  *                                                                          *
  ***************************************************************************/
  attributes: {
    
    name : { type: 'String', unique: true },
    
    surname : { type: 'String' },
    
    email: { type: 'String', email: true },
    
    coverImageUrl: { type: 'String', url: true },
    
    //FACEBOOK
    
    facebookId : {type: 'String' },
    
    facebookImageUrl: { type: 'String', url: true },
    
    //GOOGLE
    
    googleId : {type: 'String' },
    
    googleImageUrl: { type: 'String', url: true },
    
    //TWITTER
    
    twitterId : {type: 'String' },
    
    twitterImageUrl: { type: 'String', url: true },

    // Reference to many Recipes
    recipes : {
      collection: 'recipe',
      via: 'author'
    },

    // Reference to many Collections
    collections : {
      collection: 'collection',
      via: 'author'
    },

    // Reference to many Users
    followers : {
      collection: 'user',
      via: 'following'
    },

    // Reference to many Users
    following : {
      collection: 'user',
      via: 'followers'
    },

    // Reference to many Collections
    followingCollections : {
      collection: 'collection',
      via: 'followers'
    },
    
    // Reference to many votes of recipes
    votes : {
      collection: 'VoteRecipe',
      via: 'author'
    },

    // Override toJSON method to remove password from API
    toJSON: function() {
      var obj = this.toObject();
      // do nothing for now...
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

  // Generating a hash
  /*
  generateHash: function (password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },

  // Checking if password is valid
  validPassword: function (user, password) {
    //console.log("password" + password);
    console.log(this.generateHash(password));
    console.log("encryptedPassword" + user.encryptedPassword);
      try {
          return bcrypt.compareSync(password, user.encryptedPassword);
      }
      catch (exception) {
          return false;
      }
  },

  // Here we encrypt password before creating a User
  beforeCreate : function (values, next) {
    values.encryptedPassword = this.generateHash(values.password);
    next();
  },
  */
 

  /***************************************************************************
  *                                                                          *
  * Nome dell'interfaccia di connessione al database relativo                *
  * a questo modello.                                                        *
  *                                                                          *
  ***************************************************************************/
  connection: 'someMongodbServer'
};

