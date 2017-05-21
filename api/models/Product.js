/**
* Product.js
*
* @description :: Questo modello rappresenta un prodotto generico e non di marca (es.: carote, patate).
*                 Successivamente, quando il prodotto verrà usato in una ricetta diventerà
*                 un ingrediente.
*                 https://en.wikipedia.org/wiki/List_of_foods
*
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    /**
     * Indica lo stato in cui si trova l'ingrediente:
     * ok: significa che il prodotto è completo e può essere usato nelle ricette,
     * toBeCompleted: significa che il prodotto deve essere controllato dalla redazione e non può
     * essere usato nelle ricette (ad esclusione della ricetta con cui è stato creato)
     */
    state : { 
        type: 'String', 
        required: true,
        defaultsTo: 'ok',
        enum: ['ok', 'toBeCompleted'] },

    name: { type: 'json' },

    group: {
      type: 'String',
      enum: ['Caseari e ovoprodotti',
        'Spezie ed erbe',
        'Alimenti per bambini',
        'Grassi e oli',
        'Zuppe, salse e sughi',
        'Cereali da colazine',
        'Frutta e succhi di frutta',
        'Maiale', 'Verdure e derivati',
        'Lavorati di noci e semi',
        'Manzo e derivati',
        'Bevande',
        'Pesce e frutti di mare',
        'Legumi e derivati',
        'Agnello, vitello e carni di selvaggina',
        'Prodotti da forno',
        'Dolci',
        'Cereali e pasta',
        'Fast Food',
        'Antipasti e contorni',
        'Snacks',
        'Cibi di nativi americani',
        'Cibi da ristoranti']
    },

    portions: { type: 'Array' },

    nutrients: { type: 'Array' },

    // Reference to many Ingredients
    // Because a product can become an ingredient many times
    usedAsIngredient: {
      collection: 'Ingredient',
      via: 'product'
    },

    // Reference to User
    author : { 
      model :'User',
      required : false
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

