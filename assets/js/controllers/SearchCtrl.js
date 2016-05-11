/**
 * assets/js/controllers/AuthCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per esporre le funzioni di servizio di autenticazione.
 * Questo espone nello scope l'oggetto user e due metodi per fare il login
 * o la registrazione.
 */
angular.module('SearchCtrl', []).controller('SearchCtrl', [
	'$scope',
	'$state',
    '$stateParams',
    'Recipe',
    'Collection',
    'User',
	function($scope, $state, $stateParams, Recipe, Collection, User){
		
        // espongo le variabili usati allo scope
        $scope.q = $stateParams.q;
        $scope.recipes = Recipe.recipes;
        $scope.collections = Collection.collections;
        $scope.users = User.users;
        
        // espongo i wrapper per i bottoni 'carica altro'
        $scope.loadMoreRecipes = function (skip, successCB, errorCB) {
            Recipe.search($scope.q, skip, successCB, errorCB);
        }
        
        $scope.loadMoreCollections = function (skip, successCB, errorCB) {
            Collection.search($scope.q, skip, successCB, errorCB);
        }
        
        $scope.loadMoreUsers = function (skip, successCB, errorCB) {
            User.search($scope.q, skip, successCB, errorCB);
        }
        
        //controller per il timeline (slider)
        /*
        var myApp = angular.module('myapp', ['rzModule', 'ui.bootstrap']);

        myApp.controller('TestController', TestController);

        function TestController($scope, $timeout) {
            var vm = this;

            vm.priceSlider1 = {
                value: 100,
            options: {
                floor: 0,
                ceil: 500
            }
            };
        }
        */
        
        var init = function () {
            // inizializzazione del controller
            // query per ricette
            Recipe.search($scope.q);
            // query per raccolte
            Collection.search($scope.q);
            // query per persone
            User.search($scope.q);
        };
        // and fire it after definition
        init();
        
	}]);