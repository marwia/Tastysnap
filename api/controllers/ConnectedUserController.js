/**
 * ConnectedUserController
 *
 * @description :: Server-side logic for managing connected users to notification service
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
        if (!req.isSocket) {
            return res.badRequest('Only a client socket can subscribe to notification service.');
        }

        var user = req.payload;
        // Get the socket ID from the reauest
        var socketId = sails.sockets.getId(req);

        ConnectedUser.create({
            user: user.id,
            socketId: socketId
        }).exec(function (err, connectedUser) {
            if (err) { return next(err); }

            // Registro l'utente appena connesso alla ricezione di notifiche
            ConnectedUser.subscribe(req, connectedUser.id, 'message');

            res.json(connectedUser);
        });
    },


};

