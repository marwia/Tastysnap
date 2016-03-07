/**
 * assets/js/services/IngredientService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano
 * gli ingredienti e i gruppi di ingredienti.
 */
angular.module('IngredientService', [])
    .factory('Ingredient', ['$http', 'Auth', function ($http, Auth) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
            ingredients: [],
        };
    
        /**
         * Servizio per creare un gruppo di ingredienti per una data ricetta.
         */
        o.createIngredientGroup = function (recipe, ingredientGroup, successCallback) {
            return $http.post(
                server_prefix + '/recipe/'+recipe.id+'/ingredient_group',
                ingredientGroup,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    
                    ingredientGroup.recipe = recipe.id;
                    ingredientGroup.id = response.data.id;
                    successCallback(ingredientGroup);
                    
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };
        
        /**
         * Servizio per creare un gruppo di ingredienti per una data ricetta.
         */
        o.createIngredient = function (ingredient, ingredientGroup, successCallback) {
            return $http.post(
                server_prefix + '/recipe/'+ingredientGroup.recipe+'/ingredient_group/'+ingredientGroup.id+'/ingredient',
                ingredient,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(successCallback, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };
        
        /**
         * Servizio per caricare la lista di ingredienti dato un gruppo.
         */
        o.getIngredientGroupIngredients = function (ingredientGroup) {
            return $http.get(
                server_prefix + '/ingredientgroup/' + ingredientGroup.id + '/ingredients')
    
                .then(function successCallback(response) {
                    ingredientGroup.ingredients = [];
                    console.info(response.data);
                    angular.copy(response.data, ingredientGroup.ingredients);
                    
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };
        

        return o;
    }]);