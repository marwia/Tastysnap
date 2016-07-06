/**
 * NotificationController
 *
 * @description :: Server-side logic for managing Notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
     * @api {post} /recipe/:recipe/ingredient_group Create an ingredient group for a Recipe
     * @apiName CreateNotification
     * @apiGroup Recipe
     *
     * @apiDescription Serve per completare la creazione di una ricetta, in particolare 
     * si usa per creare un gruppo di ingredienti relativo ad essa. 
     * Visto che ogni ricetta deve avere un autore, soltanto l'autore può
     * eseguire la chiamata.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} recipe Recipe id.
     * @apiParam {Object} parameters Pass in body parameters with the same name as the attributes defined on your model to set those values on the desired record.
     *
     * @apiParamExample Request-Body-Example:
     *     name=Sugo
     *
     * @apiSuccess {json} recipe JSON that represents the recipe object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "Notification": 
     *       {
     *         "createdAt": "2015-08-11T18:58:46.329Z",
     *         "updatedAt": "2015-08-11T18:58:46.329Z",
     *         "id": "55ca45e69b4246110b319cb1"
     *       }
     *     }
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
	create: function (req, res, next) {
		var recipe = req.recipe;
		var Notification = req.body;
		Notification.recipe = recipe;
        Notification.ingredients = null;
        
		Notification.create(Notification).exec(function (err, created){
      		if(err){ return next(err); }

      		return res.json(created);
		});
	},

	
};

