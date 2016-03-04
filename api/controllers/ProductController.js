/**
 * ProductController
 *
 * @description :: Server-side logic for managing Products
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
     * @api {get} /product/groups Get product groups
     * @apiName GetProductGroups
     * @apiGroup Product
     *
     * @apiDescription Serve per ottenere la lista dei vari tipi di 
     * gruppi di prodotti.
     * 
     * @apiSuccess {json} group_def JSON that represents the recipe groups object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *          "type": "string",
     *          "enum": [
     *               "...",
     *               "..."
     *          ]
     *      }
     *
     */
    getProductGroups: function (req, res) {
        return res.json(sails.models.product.definition.group);
    },
    
    /**
     * @api {get} /product Get product list
     * @apiName GetProductList
     * @apiGroup Product
     *
     * @apiDescription Serve per ottenere la lista di prodotti.
     * Attenzione che i risultati sono limitati ad un numero preciso di prodotti, massimo 30 per richiesta.<br>
     * Questo end point accetta prametri.
     *
     * @apiParam {Integer} skip The number of records to skip (useful for pagination).
     * @apiParam {Integer} limit The maximum number of records to send back (useful for pagination). Defaults to 30. 
     * @apiParam {String} where Instead of filtering based on a specific attribute, you may instead choose to provide a where parameter with a Waterline WHERE criteria object, encoded as a JSON string.
     * @apiParam {String} sort The sort order. By default, returned records are sorted by primary key value in ascending order. 
     *
     * @apiParamExample Request-Param-Example:
     *     ?skip=6&limit=3
     *
     * 
     * @apiSuccess {array} product_list Array of JSON that represents the product objects.
     *
     */
    find: function (req, res, next) {
        Product.find()
            .where(actionUtil.parseCriteria(req))
            .limit(actionUtil.parseLimit(req))
            .skip(actionUtil.parseSkip(req))
            .sort(actionUtil.parseSort(req))
            .exec(function (err, foundRecipes) {
                if (err) { return next(err); }
            
                return res.json(foundRecipes);
            });
    }
	
};

