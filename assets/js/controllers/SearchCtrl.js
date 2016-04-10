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
        
        //variabile per il funzionamento della navbar della ricerca avanzata
        $scope.isCollapsed = false;
        
        //dati per riempire la select "ricerca in" nella navbar della ricerca avanzata - "ricerca in"
        $scope.items = [
            { id: 1, name: 'tutto' },
            { id: 2, name: 'ricette' },
            { id: 3, name: 'raccolte' },
            { id: 4, name: 'persone' }
        ];
        
        //dati per riempire la select "categoria" nella navbar della ricerca avanzata - "categoria"
        $scope.items2 = [
            { id: 1, name: 'primi piatti' },
            { id: 2, name: 'secondi piatti' },
            { id: 3, name: 'instalate' },
            { id: 4, name: '...' }
        ];
        
        //dati per riempire la select "difficoltà" nella navbar della ricerca avanzata - "difficoltà"
        $scope.items3 = [
            { id: 1, name: 'facile' },
            { id: 2, name: 'media' },
            { id: 3, name: 'difficile' }
        ];
        
        //dati per riempire la select "costo" nella navbar della ricerca avanzata - "costo"
        $scope.items4 = [
            { id: 1, name: 'basso' },
            { id: 2, name: 'medio' },
            { id: 3, name: 'alto' }
        ];
        
        //dati per riempire la select "calorie" nella navbar della ricerca avanzata - "calorie"
        $scope.items5 = [
            { id: 1, name: 'poco calorica' },
            { id: 2, name: 'medio calorica' },
            { id: 3, name: 'molto calorica' }
        ];
        
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