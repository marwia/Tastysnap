/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

// per generare l'hash
//var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
// per l'autenticazione basata su token JSON
var jwt = require('jsonwebtoken');

module.exports = {

  attributes: {

    username : { type: 'String', unique: true, lowercase: true },

    encryptedPassword: { type: 'String' },
 
  },

  // We don't wan't to send back encrypted password either
  toJSON: function () {
    var obj = this.toObject();
    delete obj.encryptedPassword;
    return obj;
  },

  // Generating a hash
    generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },

    // Checking if password is valid
    validPassword: function (user, password) {
      console.log("password" + password);
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
 

  connection: 'someMongodbServer'
};

