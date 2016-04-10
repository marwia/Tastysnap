/**
* ReportRecipe.js
*
* @description :: Modello che serve per tenere traccia delle segnalazioni di
*                 ricette che non rispettano i canoni di Tastysnap.
*
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        // report user notes
        notes: {
            type: 'String'
        },

        user: {
            model: 'user',
            required: true
        },

        recipe: {
            model: 'recipe',
            required: true
        },

    },

    /***************************************************************************
   *                                                                          *
   * Nome dell'interfaccia di connessione al database relativo                *
   * a questo modello.                                                        *
   *                                                                          *
   ***************************************************************************/
    connection: 'someMongodbServer'
};

