/**
* ReviewRecipe.js
*
* @description :: Il seguente modello rappresenta una recensione relativa ad un ricetta.
*                 Infatti, ciascuna prova di un utente recensire una ricetta:
*                 tipo se è economica (oppure no), se è facile (oppure no) e se è sana (oppure no).
*
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        value: {
            type: 'integer',
            required: true,
            max: 5,
            min: 0
        },

        typology: {
            type: 'String',
            required: true,
            enum: ['cost', 'difficulty', 'calories']
        },

        // the author of the review
        user: {
            model: 'user',
            required: true
        },

        // the reviewed recipe
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

