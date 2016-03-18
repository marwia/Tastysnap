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
        };

        /**
         * Metodo per richiedere una lista di collection.
         */
        o.getAll = function () {
            return $http.get(server_prefix + '/collection').success(function (data) {
                angular.copy(data, o.collections);
            });
        };
        
        /**
         * Metodo per richiedere la lista di ricette di 
         * una data collection
         */
        o.getDetailedCollectionRecipes = function () {
            return $http.get(server_prefix + '/collection/' + o.detailedCollection.id + '/recipe')
            .then(function (response) {
                o.detailedCollection.recipes = [];
                angular.copy(response.data, o.detailedCollection.recipes);
                
            }, function errorCallback(response) {
     
                    console.log(response);
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
        
        /**
         * Metodo per verificare se l'utente loggato 
         * sta seguendo una raccolta.
         */
        o.areYouFollowing = function (collectionToCheck, successCallback) {
            return $http.get(server_prefix + '/collection/'+ collectionToCheck.id+'/following/',
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }).then(function (response) {

                    collectionToCheck.isFollowed = true;
                    if (successCallback)
                        successCallback(response);
                        
                }, function (response) {
                    collectionToCheck.isFollowed = false;
                });
        };
        
        /**
         * Servizio per aggiungere una ricetta ad una raccolta
         */
        o.follow = function (collection, successCallback) {
            return $http.put(
                server_prefix + '/collection/' + collection.id + '/follow',
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    
                    collection.isFollowed = true;
                    collection.followersCount++;
                    successCallback(response);
                    
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };
        
        /**
         * Metodo per smettere di seguire una raccolta.
         */
        o.unfollow = function (collection, successCallback) {
            return $http.delete(server_prefix + '/collection/' + collection.id + '/follow',
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }).then(function (response) {
                    
                    collection.followersCount--;
                    collection.isFollowed = false;
                    if (successCallback)
                        successCallback(response);
                        
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };
        
        /**
         * Servizio per aggiungere una ricetta ad una raccolta
         */
        o.addRecipeToCollection = function (recipe, collection, successCallback) {
            return $http.put(
                server_prefix + '/collection/' + collection.id + '/recipe',
                { recipe_id: recipe.id },
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    
                    //recipe = response.data;
                    successCallback(response);
                    
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };
        
        /**
         * Servizio per ricavare la foto casuale di una sua ricetta data una collection
        */
        o.getRandomCoverBlurredImage = function (collection) {
            if (collection.recipes && collection.recipes.length > 0) {
                var idx = Math.floor(Math.random() * collection.recipes.length) + 0;
                return collection.recipes[idx].blurredCoverImageUrl;
            }
            else {
                return null;//or sample image...
            }
        };
        

        return o;
    }]);