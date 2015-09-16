/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title : { type: 'String', required: true },

    link : { type: 'String' },

    author : { type: 'String' },

    upvotes : { type: 'Integer', defaultsTo: 0},


    //Metodi d'istanza
    upvote: function (callback) {
      this.upvotes += 1;
      this.save(callback);
    }

  },

  connection: 'someMongodbServer'
};

