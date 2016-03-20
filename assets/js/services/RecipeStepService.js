/**
 * assets/js/services/RecipeStepService.js
 *
 * Mariusz Wiazowski
 *
 * Service usato per gestire i commenti a ricette.
 */

angular.module('RecipeStepService', [])
    .factory('RecipeStep', ['$http', 'Auth', 'User', function($http, Auth, User) {

        var server_prefix = '/api/v1';

        // service body    
        var o = {};

        /**
         * Servizio per creare un passo per una ricetta.
         */
        o.create = function(recipe, step, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/step',
                step,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdStep = response.data;

                    // push on top
                    if (recipe.steps == null)
                        recipe.steps = [];
                    recipe.steps.push(createdStep);

                    if (successCallback) {
                        successCallback(response);
                    }
                }
                , function(response) {
                    if (errorCallback) {
                        errorCallback(response);
                    }
                    console.log(response);
                });
        };

        

        /**
        * Metodo per richiedere la lista di passi di 
        * una ricetta.
        */
        o.getRecipeSteps = function(recipe, limit, skip, successCB, errorCB) {
            return $http.get(
                server_prefix + '/recipe/' + recipe.id + '/step',
                {
                    params: {
                        'sort': 'seq_number ASC',
                        'skip': skip,
                        'limit': limit
                    }
                })
                .then(function(response) {

                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            recipe.steps.push(response.data[i]);
                        }
                    } else {
                        recipe.steps = [];
                        angular.extend(recipe.steps, response.data);
                    }

                    if (successCB)
                        successCB(response);

                }, function errorCallback(response) {

                    console.info(response);
                    if (errorCB)
                        errorCB(response);
                });
        };

        /**
         * Funzione per eliminare un passo riguardante una ricetta.
         */
        o.delete = function(recipe, stepToDelete) {
            return $http.delete(
                server_prefix + '/recipe/' + recipe.id + '/step/'+ stepToDelete.id,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {

                    for (var i in recipe.steps) {
                        if (recipe.steps[i].id == stepToDelete.id) {
                            recipe.steps.splice(i, 1);
                            break;
                        }
                    }
                }
                , function(response) {
                    console.log(response);
                });
        };

        return o;
    }]);