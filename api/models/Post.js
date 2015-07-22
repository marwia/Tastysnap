/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title : { type: 'String' },

    link : { type: 'String' },

    author : { type: 'String' },

    upvotes : { type: 'Integer', defaultsTo: 0},

    comments:{
      collection: 'comment',
      via: 'owner'
    },

    upvote: function (callback) {
      this.upvotes += 1;
      this.save(callback);
    }

  },

  connection: 'someMongodbServer'
};

