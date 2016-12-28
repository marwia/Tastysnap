/**
 * assets/admin_assets/js/services/RecipeService.js
 *
 * Mariusz Wiazowski
 *
 * Service per gestire le operazioni sulle ricette.
 */
angular.module('RecipeService', [])
    .factory('Recipe', ['$http', 'Auth', function($http, Auth) {

        var server_prefix = '/api/v1';

        var o = {
            recipes: []
        }
        
        /**
         * Metodo per eseguire una ricerca per titolo di ricetta.
         */
        o.getRecipes = function(skip, successCB, errorCB) {
            return $http.get(server_prefix + '/recipe', {
                params: {
                    skip: skip
                }
            }).then(function(response) {
                if (skip) {
                    for (var i = 0; i < response.data.length; i++) {
                        o.recipes.push(response.data[i]);
                    }
                } else {
                    angular.extend(o.recipes, response.data);
                }
                if (successCB)
                    successCB(response);
            }, errorCB);
        };

        o.delete = function(recipeId, successCallback, errorCallback) {
            return $http.delete(
                server_prefix + '/recipe/' + recipeId)
                .then(function(response) {
                    // remove the deleted recipe
                    for (var i in o.recipes) {
                        if (o.recipes[i].id == recipeId) {
                            o.recipes.splice(i, 1);
                            break;
                        }
                    }
                    // call the cb
                    if (successCallback)
                        successCallback(response);
                }, errorCallback);
        };


        return o;

        

    }]);