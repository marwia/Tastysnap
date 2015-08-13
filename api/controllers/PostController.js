/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  	getPost: function (req, res, next) {
      // ricavo l'id del post da ricercare 
      var postId = req.param('post');// l'id è un parametro
      if (!postId) { return next(); }

    	Post.findById(postId).populate('comments').exec(function (err, posts) {
        if (err) { return next(err); }

        return res.json(posts[0]);// tocca mettere 0 
      });
  	},

    // Azione per eseguire un upVote ad un post
  	upvote: function (req, res, next) {
      var postId = req.param('post');// l'id è un parametro
      if (!postId) { return next(); }

      Post.findById(postId).exec(function (err, posts) {
        if (err) { return next(err); }

        posts[0].upvote(function (err, post) {
          if (err) { return next(err); }

          return res.json(post);
        });
      });
  	},

    // Esempio di redefinizione della classica azione di create
    create: function (req, res, next) {
      // req.body è un oggetto {...}
      req.body.author = req.payload.username;
      console.log("CT: " + req.get('Content-Type'));
      Post.create(req.body).exec(function(err, post){
        if(err){ return next(err); }
        console.log(post);
        return res.json(post);
      });
    }
	
};

