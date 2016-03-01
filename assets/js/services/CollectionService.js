/**
 * assets/js/services/CollectionService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano 
 * le collezioni di ricette.
 */
angular.module('CollectionService', [])
    .factory('Collection', ['$http', 'Auth', function ($http, Auth) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
            collections: [],
            detailedCollection: {}, // one collection 
        };
        
        /**
         * Verifica se l'utente loggatto attualmente è l'autore della collection.
         */
        o.isCollectionAuthor = function (collection) {
            if (Auth.isLoggedIn) {
                if (Auth.currentUser().id == collection.author.id) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Metodo per richiedere una lista di collection.
         */
        o.getAll = function () {
            return $http.get(server_prefix + '/collection').success(function (data) {
                angular.copy(data, o.collections);
            });
        };
    
        /**
         * Metodo per richiedere una lista di collection di un dato utente.
         */
        o.getUserCollections = function (userId) {
            return $http.get(server_prefix + '/collection', {
                params: {
                    where: {
                        "author": userId
                    }
                }
            }).success(function (data) {
                angular.copy(data, o.collections);
            });
        };

        /**
         * Metodo per cancellare una collection.
         */
        o.delete = function (collectionId, successCallback, errorCallback) {
            return $http.delete(
                server_prefix + '/collection/' + collectionId,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(successCallback, errorCallback);
        }
    
        /**
         * Metodo per richiedere una una collection tramite il suo id.
         */
        o.getCollection= function (collectionId) {
            return $http.get(server_prefix + '/collection/' + collectionId).success(function (data) {
                angular.copy(data, o.detailedCollection);
            });
        };

        /**
         * Servizio per creare una collection.
         */
        o.create = function (collection, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/collection',
                collection,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(successCallback, errorCallback);
        };

        return o;
    }]);