/**
 * assets/js/services/RecipeReviewService.js
 *
 * Mariusz Wiazowski
 *
 * Service usato per gestire le recensioni a ricette.
 */

angular.module('RecipeReviewService', [])
    .factory('RecipeReview', [
        '$http', 
        'Auth', 
        'User', 
        'toastr',
        function($http, Auth, User, toastr) {

        var server_prefix = '/api/v1';

        // service body    
        var o = {};

        /**
         * Servizio per creare un passo per una ricetta.
         */
        o.create = function(recipe, review, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/review',
                review)
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdReview = response.data;
                    
                    // inizializzo se necessario
                    if (!recipe[createdReview.typology]) {
                        recipe[createdReview.typology] = {
                            total: 0,
                            reviewsCount: 0
                        };
                    }
                    
                    // aggiungo la recensione dell'utente al totale
                    recipe[createdReview.typology].reviewsCount++;
                    recipe[createdReview.typology].total = recipe[createdReview.typology].total + createdReview.value;

                    // salvo il parere dell'utente
                    if (!recipe.user) {
                        recipe.user = {};
                    }
                    recipe.user[createdReview.typology] = createdReview;
                    
                    if (successCallback) {
                        successCallback(response);
                    }
                    toastr.success('Grazie per il tuo parere!');
                }
                , function(response) {
                    if (errorCallback) {
                        errorCallback(response);
                    }
                    console.log(response);
                });
        };
        
        /**
         * Servizio per aggiornare una recensione per una ricetta.
         */
        o.update = function(recipe, oldReview, newReview, successCallback, errorCallback) {
            return $http.put(
                server_prefix + '/recipe/' + recipe.id + '/review/' + oldReview.id,
                newReview)
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdReview = response.data;
                    
                    // inizializzo se necessario
                    if (!recipe[createdReview.typology]) {
                        recipe[createdReview.typology] = {
                            total: 0,
                            reviewsCount: 0
                        };
                    }
                    
                    // aggiorno la recensione dell'utente al totale
                    recipe[createdReview.typology].total = recipe[createdReview.typology].total + createdReview.value - oldReview.value;

                    // salvo il parere dell'utente
                    if (!recipe.user) {
                        recipe.user = {};
                    }
                    recipe.user[createdReview.typology] = createdReview;
                    
                    if (successCallback) {
                        successCallback(response);
                    }
                    toastr.success('Hai aggiornato il tuo parere.');
                }
                , function(response) {
                    if (errorCallback) {
                        errorCallback(response);
                    }
                    console.log(response);
                });
        };
        
        o.checkReview = function(recipe, successCallback, errorCallback) {
            return $http.get(
                server_prefix + '/recipe/' + recipe.id + '/reviewed')
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var userReviews = response.data;

                    // salvo il parere dell'utente
                    if (!recipe.user) {
                        recipe.user = {};
                    }
                    
                    for(i in userReviews) {
                        recipe.user[userReviews[i].typology] = userReviews[i];
                    }
                    
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
                server_prefix + '/recipe/' + recipe.id + '/review/total/' + typology)
                .then(function(response) {
    
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
                server_prefix + '/recipe/' + recipe.id + '/review/'+ reviewToDelete.id)
                .then(function(response) {
                    
                    // modifico una proprietà con nome della tipologia
                    recipe[reviewToDelete.typology].reviewsCount--;
                    recipe[reviewToDelete.typology].total = recipe[reviewToDelete.typology].total - reviewToDelete.value;
                    // elimino il parere dell'utente
                    recipe.user[reviewToDelete.typology] = null;
                    
                    toastr.success('Giudizio annullato.');
                }
                , function(response) {
                    console.log(response);
                });
        };

        return o;
    }]);