/**
* Comment.js
*
* @description :: Questo modello rappresenta un commento.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	body : { type: 'String' },

    author : { type: 'String' },

    upvotes : { type: 'Integer', defaultsTo: 0 },

    owner : { 
    	model :'post' 
    },

    recipeOwner : { 
      model :'recipe' 
    },

    upvote: function(callback) {
      this.upvotes += 1;
      this.save(callback);
    },

  },

  connection: 'someMongodbServer'
};

