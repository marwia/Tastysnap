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

/**
 * Funzione per filtrare i prodotti da completare,
 * ovvero per toglierli dalla risposta se l'utente non risulta 
 * essere autorizzato a vederli.
 * Se nei criteri di ricerca c'è il parametro 'includeAll'
 * allora vengono incluse tutti i prodotti a priscindere dal
 * loro stato (questo viene usato dalla redazione).
 */
var filterProduct = function (req, product) {

    if (req.param('includeAll') && req.param('includeAll') == true) {
        return product;
    }

    /**
     * Se il prodotto non è valido, allora non la faccio vedere.
     * Se non è valido lo faccio vedere soltanto a chi è l'autore di quel prodotto.
     */
    if (product && product.state == "toBeCompleted"
        && req.payload != undefined && product.author != req.payload.id) {
        return null;
    }

    return product;
};

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
        if (req.param('count')) {
            Product.count().exec(function (err, count) {
                if (err) { return next(err); }

                return res.json(count);
            });
        } else {
            Product.find()
                .where(actionUtil.parseCriteria(req))
                .limit(actionUtil.parseLimit(req))
                .skip(actionUtil.parseSkip(req))
                .sort(actionUtil.parseSort(req))
                .exec(function (err, foundProducts) {
                    if (err) { return next(err); }

                    // filtro i prodotti toBeCompleted 
                    foundProducts = foundProducts.filter(function (product) {
                        return filterProduct(req, product);
                    });

                    return res.json(foundProducts);
                });
        }
    },

    /**
     * @api {post} /product Create product
     * @apiName CreateProduct
     * @apiGroup Product
     *
     * @apiDescription Serve per creare un nuovo prodotto
     * Visto che ogni prodotto nuovo deve avere un autore, si deve inviare qualsiasi
     * ricetta con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} name Product name.
     *
     * @apiParam {json} product JSON string that represents the Product.
     *
     * @apiParamExample Request-Body-Example:
     *     name=Nutella
     *
     * @apiSuccess {json} product JSON that represents the product object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "product": 
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
     */
    create: function (req, res, next) {
        var user = req.payload;

        var product = req.body;
        // setto l'autore della ricetta
        product.author = user;

        /**
         * Verifico se il prodotto è completo di tutti i dettagli.
         * In generale, al momento della creazione di una ricetta gli utenti
         * non inseriranno il prodotto completo.
         */
        if (product.nutrients == undefined
            || (product.nutrients instanceof Array && product.nutrients.length == 0)
            || product.group == undefined) {
            product.state = 'toBeCompleted';
        }

        /**
         * Avviso lo staff della creazione di un prodotto
         * da essere completato.
         */
        if (product.state != undefined &&
            product.state == 'toBeCompleted') {
            EmailService.sendProductToBeCompletedNotification(product)
        }

        Product.create(product).exec(function (err, product) {
            if (err) { return next(err); }

            return res.json(product);
        });
    },

    /**
     * @api {put} /product Update product
     * @apiName UpdateProduct
     * @apiGroup Product
     *
     * @apiDescription Serve per aggiornare un prodotto.
     * Visto che ogni prodotto nuovo deve avere un autore, si deve inviare qualsiasi
     * ricetta con il token del suo autore.<br>
     * Le richieste devono essere con codifica <strong>
     * application/x-www-form-urlencoded</strong> oppure <strong>application/json.</strong>
     *
     * @apiUse TokenHeader
     *
     * @apiParam {String} name Product name.
     *
     * @apiParam {json} product JSON string that represents the Product.
     *
     * @apiParamExample Request-Body-Example:
     *     name=Nutella
     *
     * @apiSuccess {json} product JSON that represents the product object.
     *
     * @apiSuccessExample {json} Success-Response-Example:
     *     HTTP/1.1 200 OK
     *     {
     *     "product": 
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
     */
    update: function (req, res, next) {
        var user = req.payload;
        var oldProduct = req.product;

        var product = req.body;
        // setto l'autore del prodotto
        product.author = user;

        /**
         * Verifico se il prodotto è completo di tutti i dettagli.
         * In generale, al momento della creazione di una ricetta gli utenti
         * non inseriranno il prodotto completo.
         */
        if (product.nutrients == undefined
            || (product.nutrients instanceof Array && product.nutrients.length == 0)
            || product.group == undefined
            && oldProduct.state != undefined && oldProduct.state == 'toBeCompleted') {
            product.state = 'toBeCompleted';
        } else {
            product.state = 'ok';
        }

        Product.update(oldProduct.id, product).exec(function (err, product) {
            if (err) {
                console.info(err); return next(err);
            }

            return res.json(product[0]);
        });
    }

};

