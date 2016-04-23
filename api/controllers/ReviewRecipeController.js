/**
 * ReviewRecipeController
 *
 * @description :: Server-side logic for managing Tryrecipedetails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

/**
 * Module dependencies
 * 
 * Prese da https://github.com/balderdashy/sails/blob/master/lib/hooks/blueprints/actions/find.js
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
	
	/**
	* @api {post} /recipe/:recipe/review Create a review for a Recipe
	* @apiName CreateReviewRecipe
	* @apiGroup Review Recipe
	*
	* @apiDescription Serve per creare una recensione relativa ad una ricetta che si presume è stata assaggiata.
	* Visto che ogni recensione deve avere un autore, si deve inviare qualsiasi
	* richiesta con il token del suo autore.<br>
	* Ovviamente il client deve essere l'autore della prova. 
	*
	* @apiUse TokenHeader
	*
	* @apiParam {String} typology Typology of the review 
	* @apiParam {Boolean} value Value of the review. 
	* 
	* @apiSuccess {json} detail JSON that represents the review object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*     {
	*        "author": "55b275aa3e4935bc028d02c0",
	*        "recipe": "55cc9b54e75edbb10e65089c",
	*        "createdAt": "2015-09-09T09:53:20.041Z",
	*        "updatedAt": "2015-09-09T09:53:20.041Z",
	*        "id": "55f00190b6aecd11065cab85"
	*     }
	*
	* @apiUse TokenFormatError
	*
	* @apiUse NoAuthHeaderError
	*
	* @apiUse InvalidTokenError
	*/
	create: function (req, res, next) {
		var user = req.payload;
	
		// completo l'oggetto reviewRecipe
		var reviewRecipe = { 
            value: req.body.value, 
            typology: req.body.typology, 
            user: user.id,
            recipe: req.recipe.id
        };
	
		// cerco se c'è gia uno stesso reviewRecipe
		ReviewRecipe.find()
            .where({ user: user.id, recipe: req.recipe.id, typology: req.body.typology })
		    .exec(function (err, reviewRecipes) {
			    if(err){ return next(err); }
	
			    if(reviewRecipes.length > 0){ return res.json(reviewRecipes[0]); }
			
			    ReviewRecipe
                    .create(reviewRecipe)
                    .exec(function (err, reviewRecipeCreated){
				        if(err){ return next(err); }
	
				        return res.json(reviewRecipeCreated);
			    });
		});
  	},
	  
	/**
	* @api {put} /recipe/:recipe/review/:review Update a detail for a trial
	* @apiName UpdateReviewRecipe
	* @apiGroup Review Recipe
	*
	* @apiDescription Serve per modificare una recensione relativa ad una ricetta che si presume è stata assaggiata.
	* Visto che ogni recensione deve avere un autore, si deve inviare qualsiasi
	* richiesta con il token del suo autore.<br>
	* Ovviamente il client deve essere l'autore della prova. 
	*
	* @apiUse TokenHeader
	*
	* @apiParam {String} typology Typology of the review. 
	* @apiParam {Boolean} value New value of the review.
	* 
	* @apiSuccess {json} detail JSON that represents the detail object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*     {
	*        "value": "4",
	*        "typology": "cheap",
	*        "createdAt": "2015-09-09T09:53:20.041Z",
	*        "updatedAt": "2015-10-24T22:33:20.041Z",
	*        "id": "55f00190b6aecd11065cab85"
	*     }
	*
	* @apiUse TokenFormatError
	*
	* @apiUse NoAuthHeaderError
	*
	* @apiUse InvalidTokenError
	*/
	update: function (req, res, next) {
		var user = req.payload;
		
		var reviewId = req.param('review');
        if (!reviewId) { return next(); }
	
		// completo l'oggetto tryRecipeDetail
		var newTryRecipeDetail = { value: req.body.value };
	
		// cerco se c'è gia uno stesso tryRecipeDetail
		ReviewRecipe
            .update(reviewId, newTryRecipeDetail)
		    .exec(function (err, updatedTryRecipeDetails) {
			    if(err){ return next(err); }
				console.info(updatedTryRecipeDetails[0]);
			    return res.json(updatedTryRecipeDetails[0]);
		});
  	},
	  
	/**
	* @api {delete} /recipe/:recipe/review/:review Delete a review related to a Recipe
	* @apiName DeleteReviewRecipe
	* @apiGroup Review Recipe
	*
	* @apiDescription Serve eliminare una propria recensione relativa ad una ricetta.
	* Visto che ogni recensione di una prova e la prova stessa devono avere un autore,
	* si deve inviare qualsiasi richiesta con il token del suo autore.<br>
	*
	* @apiUse TokenHeader
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 204 No Content
	*
	* @apiUse TokenFormatError
	*
	* @apiUse NoAuthHeaderError
	*
	* @apiUse InvalidTokenError
	*
	* @apiUse NoPermissionError
	*
	* @apiUse NoRecipeError
	*/
	destroy: function (req, res, next) {
		var reviewId = req.param('review');
        if (!reviewId) { return next(); }
		
		ReviewRecipe.destroy(reviewId).exec(function (err){
			if(err){ return next(err); }
	
			return res.send(204, null);// eliminato
		});
	},
    
    /**
	* @api {get} /recipe/:recipe/review List the reviews for a Recipe
	* @apiName GetReviewsRecipe
	* @apiGroup Review Recipe
	*
	* @apiDescription Serve a richiedere la lista di recensioni relative a una ricetta.
	* <br>
	* Non sono richiesti ne parametri ne le credenziali dell'utente. 
	*
	* @apiSuccess {json} reviews JSON that represents the review list object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*  [
	*    {
    *      "value": "4",
	*      "typology": "cheap",
	*      "user": {
	*        "username": "cavallo",
	*        "createdAt": "2015-07-24T17:28:10.577Z",
	*        "updatedAt": "2015-07-24T17:28:10.577Z",
	*        "id": "55b275aa3e4935bc028d02c0"
	*       },
	*      "recipe": "55cc9b54e75edbb10e65089c",
	*      "createdAt": "2015-09-09T09:53:20.041Z",
	*      "updatedAt": "2015-09-09T09:53:20.041Z",
	*      "id": "55f00190b6aecd11065cab85"
	*    }
	*  ]
	*
	* @apiUse NoRecipeError
	*/
    find: function (req, res, next) {
        ReviewRecipe.find()
            .where({ recipe: req.recipe.id })
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .populate('user')
            .exec(function (err, reviewRecipes) {

                if (err) { return next(err); }
                
                if (reviewRecipes.length == 0) {
                    return res.notFound();
                }

                return res.json(reviewRecipes);
            });
    },
    
    /**
	* @api {get} /recipe/:recipe/review/:review Get a review by id
	* @apiName GetReviewRecipe
	* @apiGroup Review Recipe
	*
	* @apiDescription Serve a richiedere una recensione relativa ad una ricetta.
	* <br>
	* Non sono richiesti ne parametri ne le credenziali dell'utente. 
	*
	* @apiSuccess {json} review JSON that represents the review object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*    {
    *      "value": "4",
	*      "typology": "cheap",
	*      "user": {
	*        "username": "cavallo",
	*        "createdAt": "2015-07-24T17:28:10.577Z",
	*        "updatedAt": "2015-07-24T17:28:10.577Z",
	*        "id": "55b275aa3e4935bc028d02c0"
	*       },
	*      "recipe": "55cc9b54e75edbb10e65089c",
	*      "createdAt": "2015-09-09T09:53:20.041Z",
	*      "updatedAt": "2015-09-09T09:53:20.041Z",
	*      "id": "55f00190b6aecd11065cab85"
	*    }
	*
	* @apiUse NoRecipeError
	*/
    findOne: function (req, res, next) {
        var reviewId = req.param('review');
        if (!reviewId) { return next(); }
        
        ReviewRecipe.findOne(reviewId)
            .populate('user')
            .exec(function (err, reviewRecipe) {

                if (err) { return next(err); }
                
                if (!reviewRecipe) {
                    return res.notFound();
                }

                return res.json(reviewRecipe);
            });
    },
    
    /**
	* @api {get} /recipe/:recipe/reviewed Check if you reviewed a Recipe
	* @apiName CheckReviewRecipe
	* @apiGroup Review Recipe
	*
	* @apiDescription Serve a controllare se l'utente ha recensito una ricetta.
	* <br>
	* Necessita di autenticazione.
	*
	* @apiUse TokenHeader
	*
	* @apiSuccess {json} try JSON that represents the try object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*    {
    *      "value": "4",
	*      "typology": "cheap",
	*      "user": {
	*        "username": "cavallo",
	*        "createdAt": "2015-07-24T17:28:10.577Z",
	*        "updatedAt": "2015-07-24T17:28:10.577Z",
	*        "id": "55b275aa3e4935bc028d02c0"
	*       },
	*      "recipe": "55cc9b54e75edbb10e65089c",
	*      "createdAt": "2015-09-09T09:53:20.041Z",
	*      "updatedAt": "2015-09-09T09:53:20.041Z",
	*      "id": "55f00190b6aecd11065cab85"
	*    }
	*
	* @apiErrorExample Error-Response:
	*     HTTP/1.1 404 Not Found
	*
	* @apiUse TokenFormatError
	*
	* @apiUse NoAuthHeaderError
	*
	* @apiUse InvalidTokenError
	*
	* @apiUse NoRecipeError
	*/
    checkReview: function (req, res, next) {
        var user = req.payload;

        ReviewRecipe.find()
            .where({ recipe: req.recipe.id, user: user.id })
            .exec(function (err, reviewRecipes) {
                
            if (err) { return next(err); }

            if (reviewRecipes.length == 0) {
                return res.notFound();
            }
            return res.json(reviewRecipes);
        });
    },
    
    /**
	* @api {get} /recipe/:recipe/review Check if you reviewed a Recipe
	* @apiName CheckReviewRecipe
	* @apiGroup Review Recipe
	*
	* @apiDescription Serve a controllare se l'utente ha recensito una ricetta.
	* <br>
	* Necessita di autenticazione.
	*
	* @apiUse TokenHeader
	*
	* @apiSuccess {json} try JSON that represents the try object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*    {
    *      "total": 4832,
	*      "reviewsCount": 1043
	*    }
	*
	* @apiErrorExample Error-Response:
	*     HTTP/1.1 404 Not Found
	*
	* @apiUse TokenFormatError
	*
	* @apiUse NoAuthHeaderError
	*
	* @apiUse InvalidTokenError
	*
	* @apiUse NoRecipeError
	*/
    getTotalValueForTypology: function (req, res, next) {
        var typology = req.param('typology');
        if (!typology) { return next(); }
        
        ReviewRecipe.find()
            .where({ recipe: req.recipe.id, typology: typology })
            .exec(function (err, foundReviews) {
                
            if (err) { return next(err); }

            if (foundReviews.length == 0) {
                return res.notFound();
            }
            
            // calcolo il valore totale delle recensioni
            var total = 0;
            for (var k in foundReviews) {
                total += foundReviews[k].value;
            }
            
            return res.json({
                total: total,
                reviewsCount: foundReviews.length
            });
        });
    },
	
	/**
     * @api {get} /review/typologies Get trial's detail typologies
     * @apiName GetReviewTypologies
     * @apiGroup Review Recipe
     *
     * @apiDescription Serve per ottenere la lista dei vari tipi di 
     * tipologies di recensioni che si possono associare ad una ricetta.
     * 
     * @apiSuccess {json} recipe JSON that represents the review typologies object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *      "type": "string",
     *      "enum": [
     *          "cheap",
     *          "easy",
     *          "healthy"
     *      ]
     *    }
     *
     */
    getTypologies: function (req, res) {
        return res.json(sails.models.tryrecipedetail.definition.typology);
    }
	
};

