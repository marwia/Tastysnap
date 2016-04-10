/**
 * RecipeStepController.js
 *
 * @description :: Server-side logic for managing steps for recipes.
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
     * @api {post} /recipe/:recipe/step Create a step for a Recipe
     * @apiName CreateRecipeStep
     * @apiGroup Recipe Step
     *
     * @apiDescription Serve per creare un step (passo) nella creazione 
     * di una ricetta.
     *
     * @apiUse TokenHeader
     *
     * @apiSuccess {json} vote JSON that represents the vote object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *      {
     *        "description": "Soffriggere la cipolla nella padella con un filo d'olio.",
     *        "seq_number": 1,
     *        "recipe": "55cc9b54e75edbb10e65089c",
     *        "createdAt": "2015-09-09T09:53:20.041Z",
     *        "updatedAt": "2015-09-09T09:53:20.041Z",
     *        "id": "55f00190b6aecd11065cab85"
     *      }
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
        
        var step = req.body;
        step.recipe = req.recipe.id;

        //cerco se c'è gia uno stesso vote
        RecipeStep.create(step).exec( function (err, createdStep) {
            if (err) { return next(err); }
            
            return res.json(201, createdStep);
        })
    },

    /**
     * @api {delete} /recipe/:recipe/step/:step Delete a step from Recipe
     * @apiName DeleteRecipeStep
     * @apiGroup Recipe Step
     *
     * @apiDescription Serve eliminare un step di una ricetta.
     * Visto che ogni voto deve avere un autore, si deve inviare qualsiasi
     * richiesta con il token del suo autore.<br>
     * Non sono richiesti parametri. 
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

        var recipeStepToDelete = { id: req.param('step'), recipe: req.recipe.id };

        RecipeStep.destroy(recipeStepToDelete).exec(function (err) {
            if (err) { return next(err); }

            return res.send(204, null);// eliminato
        });
    },

    /**
     * @api {get} /recipe/:recipe/step List the steps for a Recipe
     * @apiName GetRecipeSteps
     * @apiGroup Recipe Step
     *
     * @apiDescription Serve a richiedere la lista dei passi del procedimento di una ricetta.
     * <br>
     * Non sono richiesti ne parametri ne le credenziali dell'utente. 
     *
     * @apiSuccess {Array} vote_list Array that represents the steps
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *  [
     *      "description": "Descrizione...",
     *      "seq_number": 1,
     *      "recipe": "55cc9b54e75edbb10e65089c",
     *      "createdAt": "2015-09-09T09:53:20.041Z",
     *      "updatedAt": "2015-09-09T09:53:20.041Z",
     *      "id": "55f00190b6aecd11065cab85"
     *    }
     *  ]
     *
     * @apiUse NoRecipeError
     */
    findSteps: function (req, res, next) {
        
        RecipeStep.find()
            .where({ recipe: req.recipe.id})
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .exec(function (err, recipeSteps) {
                if (err) { return next(err); }

                return res.json(recipeSteps);
            });
    },
    
    /**
     * @api {put} /recipe/:recipe/step/:step Update a step for a Recipe
     * @apiName UpdateRecipeSteps
     * @apiGroup Step Recipe
     *
     * @apiDescription Serve per aggiornare un passo di una ricetta di cui
     * si è autore.
     * <br>
     * Non sono richiesti ne parametri ne le credenziali dell'utente. 
     *
     * @apiSuccess {JSON} recipe_step JSON that represents the step
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *    {
     *      "description": "Descrizione...",
     *      "seq_number": 1,
     *      "recipe": "55cc9b54e75edbb10e65089c",
     *      "createdAt": "2015-09-09T09:53:20.041Z",
     *      "updatedAt": "2015-09-09T09:53:20.041Z",
     *      "id": "55f00190b6aecd11065cab85"
     *    }
     *
     * @apiUse NoRecipeError
     */
    update: function (req, res, next) {
        
        var id = req.param('step');
        if (!id) { return res.badRequest(); }
        
        var step = req.body;
        delete step.id;
        step.recipe = req.recipe.id;
                
        RecipeStep.update({id: id}, step)
            .exec(function (err, updatedSteps) {
                if (err) { return next(err); }
                
                if (updatedSteps.length == 0) { return res.notFound(); }
                
                return res.json(updatedSteps[0]);
            });
    },

};

