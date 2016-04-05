/**
* TryRecipeDetail.js
*
* @description :: Il seguente modello rappresenta un dettaglio ad una prova relativa ad un ricetta.
*                 Infatti, ciascuna prova di un utente può avere ulteriori dettagli:
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
            enum: ['cheap', 'easy', 'healthy']
        },

        trial: {
            model: 'TryRecipe',
            required: true
        }

    },

    /***************************************************************************
   *                                                                          *
   * Nome dell'interfaccia di connessione al database relativo                *
   * a questo modello.                                                        *
   *                                                                          *
   ***************************************************************************/
    connection: 'someMongodbServer'
};

