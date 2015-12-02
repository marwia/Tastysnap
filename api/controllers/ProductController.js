/**
 * ProductController
 *
 * @description :: Server-side logic for managing Products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/**
     * @api {get} /product/categories Get product categories
     * @apiName GetProductCategories
     * @apiGroup Product
     *
     * @apiDescription Serve per ottenere la lista dei vari tipi di 
     * categorie di prodotti.
     * 
     * @apiSuccess {json} recipe JSON that represents the dosage types object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *          "type": "string",
     *          "enum": [
     *               "breads",
     *               "condiments"
     *          ]
     *      }
     *
     */
    getProductCategories: function (req, res) {
        return res.json(sails.models.product.definition.category);
    }
	
};

