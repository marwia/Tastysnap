/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  	getRecipe: function (req, res, next) {
      // ricavo l'id del post da ricercare 
      var recipeId = req.param('recipe');// l'id è un parametro
      if (!recipeId) { return next(); }

    	Recipe.findOne(recipeId).populate('comments').exec(function (err, recipe) {
        if (err) { return next(err); }

        return res.json(recipe);// tocca mettere 0 
      });
  	},

    // Azione per eseguire un upVote ad un post
  	upvote: function (req, res, next) {
      var recipeId = req.param('recipe');// l'id è un parametro
      if (!recipeId) { return next(); }

      Recipe.findOne(recipeId).exec(function (err, recipe) {
        if (err) { return next(err); }

        recipe.upvote(function (err, post) {
          if (err) { return next(err); }

          return res.json(post);
        });
      });
  	},

    // Esempio di redefinizione della classica azione di create
    create: function (req, res, next) {
      // req.body è un oggetto {...}
      req.body.author = req.payload.username;
      Recipe.create(req.body).exec(function(err, recipe){
        if(err){ return next(err); }
        console.log(recipe);
        return res.json(recipe);
      });
    }
	
};

