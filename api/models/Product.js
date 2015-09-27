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

  	name : { type: 'String', required: true },

  	category: {
    	type: 'String',
    	required: true, 
    	enum: ['breads', 
    	'condiments', 
    	'butter', 'cheese', 'milk', 'yogurts',
    	'eggs', 
    	'fruits', 'vegetables', 
    	'meat', 
    	'seafood', 
    	'sauce', 
    	'pasta', 'rice', 'legumes',
    	'flour',
    	'edible fungi',
    	'nuts and seeds',
    	'cereals']
  	},

  	// Reference to many Ingredients
  	// Because a product can become an ingredient many times
    usedAsIngredient : {
      collection: 'Ingredient',
      via: 'product'
    }

  }
};

