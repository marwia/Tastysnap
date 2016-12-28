/**
 * assets/admin_assets/js/services/CollectionService.js
 *
 * Mariusz Wiazowski
 *
 * Service per gestire le operazioni sulle raccolte.
 */
angular.module('CollectionService', [])
    .factory('Collection', ['$http', 'Auth', function($http, Auth) {

        var server_prefix = '/api/v1';

        var o = {
            collections: []
        }

         /**
         * Metodo per richiedere una lista di collection.
         */
        o.getCollections = function (order_by, skip, successCB, errorCB) {
            return $http.get(server_prefix + '/collection',
                {
                    params: {
                        'skip': skip,
                        'order': order_by
                    }
                }).then(function(response) {
                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            o.collections.push(response.data[i]);
                        }
                    } else {
                        angular.extend(o.collections, response.data);
                    }
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

        /**
         * Metodo per cancellare una collection.
         */
        o.delete = function (collectionId, successCallback, errorCallback) {
            return $http.delete(
                server_prefix + '/collection/' + collectionId)
                .then(function(response) {
                    // remove the deleted collection
                    for (var i in o.collections) {
                        if (o.collections[i].id == collectionId) {
                            o.collections.splice(i, 1);
                            break;
                        }
                    }
                    if (successCallback)
                        successCallback();
                }, errorCallback);
        }

        return o;

        

    }]);