/**
 * isProductAuthor.js
 *
 * Questa è una politica che si occupa di verificare se l'utente che vuole eseguire
 * una update su una risorsa è il suo autore.
 *
 * ATTENZIONE: si deve implementarla per ogni Model che si ritiene opportuno.
 *
 * @description :: Policy to check if user is authorized to update a resource.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
    var user = req.payload;

    var id = req.param('id');

    // caso alternativo se il parametro dell'id ha un nome diverso
    if (req.param('product'))
        id = req.param('product');

    Product
        .findOne(id)
        .exec(function (err, originalProduct) {
            if (err) { return next(err); }

            if (!originalProduct) { return res.notFound({ error: 'No product found' }); }

            // per sicurezza elimino l'author 
            delete req.body.author;// cancello elementi inopportuni
            req.product = originalProduct;

            // verifico che l'utente è il creatore della risorsa
            if (originalProduct.author == user.id) {
                next();

                // altrimenti verifico se l'utente possiede permessi d'amministratore   
            } else {
                UserPermission
                    .findOne({ email: user.email, type: 'admin' })
                    .exec(function (err, foundUser) {
                        if (err) { return next(err); }

                        if (!foundUser) { return res.json(401, { error: 'NoPermission' }); }

                        next();
                    });
            }
        });

};