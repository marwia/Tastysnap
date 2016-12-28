/**
 * UserPermission.js
 *
 * @description :: Modello per gestire i permessi per l'accesso a statistiche del social network e 
 *                 per modificare tutti i contenuti del sito.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    email: { type: 'String', email: true },

    /**
     * admin: può modificare e visualizzare
     * view: può solo modificare
     */
    type: { type: 'String', required: true, enum: ['admin', 'view' ] }

  }

};

