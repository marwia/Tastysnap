/**
* Recipe.js
*
* @description :: Rappresenta una generica ricetta che ogni utente
*                 iscritto alla piattaforma può creare.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  /***************************************************************************
  *                                                                          *
  * Attributi e metodi d'istanza, ovvero oggetti che vengono creati ogni     *
  * volta che viene creato un oggetto di questa classe.                      *
  *                                                                          *
  ***************************************************************************/
  attributes: {

    title : { type: 'String', required: true },
    
    // recipe preparation time in minutes
    preparationTime : { type: 'Integer', required: true },
    
    // Example: "Dosages for 8 persons"
    dosagesFor : { type: 'Integer', required: true },
    
    dosagesType : { 
        type: 'String', 
        required: true,
        enum: ['persone', 'unità'] },
    
    category : { 
        type: 'String',
        required: true,
        enum: ['primi piatti', 
        'secondi piatti', 
        'zuppe', 
        'insalate',
        'antipasti e stuzzichini', 
        'dessert e torte', 
        'bevande', 
        'cocktails',
        'contorni',
        'marmellate e conserve',
        'salse']
        /*enum: ['first courses', 
        'second courses', 
        'soups', 
        'salads',
        'appetizers and snacks', 
        'desserts and cakes', 
        'beverages', 
        'cocktails',
        'side dishes',
        'jams and preserves',
        'sauces']*/
    },
    
    // Url which represents the main image of the recipe
    coverImageUrl : { type: 'String', url: true },
    
    dominantColor : { type: 'String', hexColor: true },
    
    // Url which represents the blurred main image of the recipe
    blurredCoverImageUrl : { type: 'String', url: true },
    
    otherImageUrls : { type: 'Array' },
    
    // coordinate in geoJSON 
    coordinates: { type: 'json' },
    // per riferimento memorizzo anche l'id del posto (offerto da Google)
    googlePlaceId: { type: 'String' },
    // per riferimento memorizzo anche il reference del posto (offerto da Google)
    googlePlaceRef: { type: 'String' },

    /**
     * Coordinate in geoJSON attribuite al momento della creazione della ricetta.
     * Vengono rilevate dal server e non dal client.
     */
    creationCoordinates: { type: 'json' },

    /**
     * Indica lo stato degli ingredienti della ricetta.
     * ok: la ricetta è valida,
     * toBeValidate: la ricetta contiene ingredienti che devono essere validati
     * dalla redazione, pertanto può essere visibile soltanto all'autore
     * notValid: la ricetta è contiene ingredienti che violano le regole e pertanto
     * non può essere mostrata.
     */
    ingredientState : { 
        type: 'String', 
        required: true,
        enum: ['ok', 'toBeValidate', 'notValid'] },

    // Reference to User
    author : { 
      model :'User',
      required : true
    },

    // Reference to many Ingredient Groups
    ingredientGroups : {
      collection: 'IngredientGroup',
      via: 'recipe'
    },
    
    // Reference to many Collections
    steps : {
      collection: 'RecipeStep',
      via: 'recipe'
    },

    // Reference to many Likes or Not likes
    votes : {
      collection: 'VoteRecipe',
      via: 'recipe'
    },

    // Reference to many Views
    views : {
      collection: 'ViewRecipe',
      via: 'recipe'
    },

    // Reference to many Comments
    comments : {
      collection: 'Comment',
      via: 'recipe'
    },
    
    // Reference to many Trials
    trials : {
      collection: 'TryRecipe',
      via: 'recipe'
    },
    
    // Reference to many Reviews
    reviews : {
      collection: 'ReviewRecipe',
      via: 'recipe'
    },

    // Reference to many Collections
    collections : {
      collection: 'CollectionRecipe',
      via: 'recipe'
    },

  },
  /***************************************************************************
  *                                                                          *
  * Metodi della classe (una sorta di metodi statici in Java).               *
  *                                                                          *
  ***************************************************************************/

  /***************************************************************************
  *                                                                          *
  * Nome dell'interfaccia di connessione al database relativo                *
  * a questo modello.                                                        *
  *                                                                          *
  ***************************************************************************/
  connection: 'someMongodbServer'
};

