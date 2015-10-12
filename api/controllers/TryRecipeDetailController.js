/**
 * TryRecipeDetailController
 *
 * @description :: Server-side logic for managing Tryrecipedetails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/**
	* @api {post} /recipe/:recipe/try/detail Create a detail for a trial
	* @apiName CreateTryRecipeDetail
	* @apiGroup Try Recipe Detail
	*
	* @apiDescription Serve per creare un dettaglio relativo ad una ricetta che è stata assaggiata.
	* Visto che ogni dettaglio deve avere un autore, si deve inviare qualsiasi
	* richiesta con il token del suo autore.<br>
	* Ovviamente il client deve essere l'autore della prova. 
	*
	* @apiUse TokenHeader
	*
	* @apiParam {String} typology Typology of the try detail. 
	* @apiParam {Boolean} value Value of the try detail. 
	* 
	* @apiSuccess {json} detail JSON that represents the detail object.
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
		var trial = req.userTrial;
	
		// completo l'oggetto tryRecipeDetail
		var tryRecipeDetail = { value: req.body.value, typology: req.body.typology, trial: trial.id };
	
		// cerco se c'è gia uno stesso tryRecipeDetail
		TryRecipeDetail.find().where({ value: req.body.value, typology: req.body.typology, trial: trial.id })
		.exec(function (err, tryRecipeDetails) {
			if(err){ return next(err); }
	
			if(tryRecipeDetails.length > 0){ return res.json(tryRecipeDetails[0]); }
			
			TryRecipeDetail.create(tryRecipeDetail).exec(function (err, tryRecipeDetailCreated){
				if(err){ return next(err); }
	
				return res.json(tryRecipeDetailCreated);
			});
		});
  	},
	  
	/**
	* @api {put} /recipe/:recipe/try/detail Update a detail for a trial
	* @apiName CreateTryRecipeDetail
	* @apiGroup Try Recipe Detail
	*
	* @apiDescription Serve per modificare un dettaglio relativo ad una ricetta che è stata assaggiata.
	* Visto che ogni dettaglio deve avere un autore, si deve inviare qualsiasi
	* richiesta con il token del suo autore.<br>
	* Ovviamente il client deve essere l'autore della prova. 
	*
	* @apiUse TokenHeader
	*
	* @apiParam {String} typology Typology of the try detail. 
	* @apiParam {Boolean} value New value of the try detail.
	* 
	* @apiSuccess {json} detail JSON that represents the detail object.
	*
	* @apiSuccessExample {json} Success-Response-Example:
	*     HTTP/1.1 200 OK
	*     {
	*        "value": "true",
	*        "typology": "cheap",
	*		 "trial": "55f00190b6aecd11065cab83",
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
		var trial = req.userTrial;
	
		// completo l'oggetto tryRecipeDetail
		var newTryRecipeDetail = { value: req.body.value };
	
		// cerco se c'è gia uno stesso tryRecipeDetail
		TryRecipeDetail.update({ typology: req.body.typology, trial: trial.id }, newTryRecipeDetail)
		.exec(function (err, updatedTryRecipeDetails) {
			if(err){ return next(err); }
	
			return res.json(updatedTryRecipeDetails[0]);
		});
  	},
	  
	/**
	* @api {delete} /recipe/:recipe/try/detail Delete a try detail related to a Recipe
	* @apiName DeleteTryDetailRecipe
	* @apiGroup Try Recipe Detail
	*
	* @apiDescription Serve eliminare un proprio dettaglio di una prova relativa ad una ricetta.
	* Visto che ogni dettaglio di una prova e la prova stessa devono avere un autore,
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
		var user = req.payload;
		var trial = req.userTrial;
	
		var tryRecipeDetailToDelete = { typology: req.body.typology, trial: trial.id };
	
		TryRecipeDetail.destroy(tryRecipeDetailToDelete).exec(function (err){
			if(err){ return next(err); }
	
			return res.send(204, null);// eliminato
		})
	},
	
};

