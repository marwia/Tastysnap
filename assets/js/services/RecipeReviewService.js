/**
 * assets/js/services/RecipeReviewService.js
 *
 * Mariusz Wiazowski
 *
 * Service usato per gestire le recensioni a ricette.
 */

angular.module('RecipeReviewService', [])
    .factory('RecipeReview', ['$http', 'Auth', 'User', function($http, Auth, User) {

        var server_prefix = '/api/v1';

        // service body    
        var o = {};

        /**
         * Servizio per creare un passo per una ricetta.
         */
        o.create = function(recipe, review, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/review',
                review,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdReview = response.data;

                    // push on top
                    if (recipe.reviews == null)
                        recipe.reviews = [];
                    recipe.reviews.push(createdReview);

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
        o.getRecipeTotalValueForTypology = function(recipe, typology, successCB, errorCB) {
            return $http.get(
                server_prefix + '/recipe/' + recipe.id + '/review/total/' + typology,
                null
                ).then(function(response) {
    
                    // aggiungo una proprietà con nome della tipologia
                    recipe[typology] = response.data;

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
        o.delete = function(recipe, reviewToDelete) {
            return $http.delete(
                server_prefix + '/recipe/' + recipe.id + '/review/'+ reviewToDelete.id,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    
                    // modifico una proprietà con nome della tipologia
                    recipe[reviewToDelete.typology].reviewsCount--;
                    recipe[reviewToDelete.typology].total = recipe[typology].total - reviewToDelete.value;
                }
                , function(response) {
                    console.log(response);
                });
        };

        return o;
    }]);