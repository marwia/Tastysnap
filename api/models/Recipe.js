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
        'dessert and torte', 
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

    // Reference to User
    author : { 
      model :'user',
      required : true
    },

    // Reference to many Ingredient Groups
    ingredientGroups : {
      collection: 'IngredientGroup',
      via: 'recipe'
    },
    
    // Reference to many Collections
    steps : {
      collection: 'recipeStep',
      via: 'recipe'
    },

    // Reference to many Likes or Not likes
    votes : {
      collection: 'voteRecipe',
      via: 'recipe'
    },

    // Reference to many Views
    views : {
      collection: 'viewRecipe',
      via: 'recipe'
    },

    // Reference to many Comments
    comments : {
      collection: 'comment',
      via: 'recipe'
    },
    
    // Reference to many Trials
    trials : {
      collection: 'tryRecipe',
      via: 'recipe'
    },
    
    // Reference to many Reviews
    reviews : {
      collection: 'reviewRecipe',
      via: 'recipe'
    },

    // Reference to many Collections
    collections : {
      collection: 'collection',
      via: 'recipes'
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

