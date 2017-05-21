/**
 * assets/admin_assets/js/services/ProductService.js
 *
 * Mariusz Wiazowski
 *
 * Service per gestire le operazioni sulle raccolte.
 */
angular.module('ProductService', [])
    .factory('Product', ['$http', 'Auth', function($http, Auth) {

        var server_prefix = '/api/v1';

        var o = {
            products: [],
            productsCount: 0,
            groups: []// categorie di prodotti
        }

         /**
         * Metodo per richiedere una lista di Product.
         */
        o.getProducts = function (order_by, skip, reset, successCB, errorCB) {
            return $http.get(server_prefix + '/product',
                {
                    params: {
                        'skip': skip,
                        'sort': order_by
                    }
                }).then(function(response) {
                    if (skip && reset == false) {
                        for (var i = 0; i < response.data.length; i++) {
                            o.products.push(response.data[i]);
                        }
                    } else {
                        angular.extend(o.products, response.data);
                    }
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

         /**
         * Metodo per richiedere il numero totale di Product.
         * Utile per la paginazione.
         */
        o.getProductsCount = function (successCB, errorCB) {
            return $http.get(server_prefix + '/product',
                {
                    params: {
                        'count': true
                    }
                }).then(function(response) {
                    angular.copy(response.data, o.productsCount);
                    o.productsCount = response.data;
                    
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

        /**
         * Per richiedere le categorie di prodotti.
         */
        o.getProductGroups = function (successCB, errorCB) {
            return $http.get(server_prefix + '/product/groups')
                .then(function(response) {
                    angular.copy(response.data.enum, o.groups);
                    if (successCB)
                        successCB(response);
                }, errorCB);
        };

        /**
         * Metodo per cancellare un prodotto (ingrediente).
         */
        o.delete = function (productId, successCallback, errorCallback) {
            return $http.delete(
                server_prefix + '/product/' + productId)
                .then(function(response) {
                    // remove the deleted Product
                    for (var i in o.Products) {
                        if (o.products[i].id == productId) {
                            o.products.splice(i, 1);
                            break;
                        }
                    }
                    if (successCallback)
                        successCallback(response);
                }, errorCallback);
        };

        /**
         * Servizio per aggiungerer un nuovo prodotto.
         */
        o.create = function (product, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/product',
                product)
                .then(function (response) {
                    // push on top
                    o.products.unshift(response.data);

                    if (successCallback)
                        successCallback(response);

                }, errorCallback);
        };

        /**
         * Servizio per aggiungerer un nuovo prodotto.
         */
        o.update = function (product, successCallback, errorCallback) {
            return $http.put(
                server_prefix + '/product/' + product.id,
                product)
                .then(function (response) {
                    // update object
                    angular.copy(response.data, product);

                    if (successCallback)
                        successCallback(response);

                }, errorCallback);
        };

        return o;

        

    }]);