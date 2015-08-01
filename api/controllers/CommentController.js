/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	// Azione per aggiungere un commento ad un post
	create: function (req, res, next) {
    // ATTENZIONE: nel body c'è il commento
    

    var postId = req.param('post');// l'id è un parametro
    if (!postId) { return next(); }

    req.body.author = req.payload.username;
    
    Post.findById(postId).exec(function (err, posts) {
      // al commento aggiungo il post
      req.body.owner = posts[0];

      // req.body è un oggetto {...}
      Comment.create(req.body).exec(function (err, comment){
        if(err){ return next(err); }

        return res.json(comment);
      });
    });
	},

	// Azione per dare un upvote ad un commento
	upvote: function(req, res, next) {
    var commentId = req.param('comment');// l'id è un parametro
    if (!commentId) { return next(); }

    Comment.findById(commentId).exec(function (err, comments) {
      if (err) { return next(err); }
      
      comments[0].upvote(function (err, comment){
        if (err) { return next(err); }

        return res.json(comment);
      });
    });
	}
	
};

