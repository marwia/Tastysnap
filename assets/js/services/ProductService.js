/**
 * assets/js/services/ProductService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano
 * i prodotti alimentari.
 */
angular.module('ProductService', [])
    .factory('Product', ['$http', 'Auth', function ($http, Auth) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
            products: [],
        };
    
        /**
         * Metodo per richiedere una lista di ricette di un dato utente.
         */
        o.searchProductsByName = function (productName) {
            return $http.get(server_prefix + '/product', {
                params: {
                    where: {
                        "name.long": {"contains": productName}
                    }
                }
            }).then(function (response) {
                //angular.copy(data, o.recipes);
                return response.data;
            });
        };

        /**
         * Metodo per creare un nuovo prodotto.
         */
        o.createProduct = function (product, successCallback, errorCallback) {
            return $http.post(server_prefix + '/product', product)
                .then(successCallback, errorCallback);
        }
        

        return o;
    }]);
