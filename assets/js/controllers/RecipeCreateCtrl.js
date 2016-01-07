/**
 * assets/js/controllers/RecipeCreateCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per la creazione di una ricetta.
 */
angular.module('RecipeCreateCtrl', []).controller('RecipeCreateCtrl', [
    '$scope', // lo scope
    '$state', // gestione degli stati dell'app (ui-router)
    'Recipe', // servizio per le ricette
    'Auth', // servizio per l'autenticazione
    '$filter',
    function ($scope, $state, Recipe, Auth, $filter) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;
		
        // espongo le categorie delle ricette estraendole dal servizio
        // il caricamento della categorie viene eseguito ad ogni
        // ingresso nello stato in cui si crea una ricetta
        $scope.recipeCategories = Recipe.recipeCategories;
        $scope.selected_category = $scope.recipeCategories[0];
        // espongo il tipo di dosaggio preso sempre dal servizio dedicato alle ricette
        $scope.dosageTypes = Recipe.dosagesTypes;
        $scope.selected_dosage_type = $scope.dosageTypes[0];

        $scope.dosagesFor;
        $scope.desscription;
		
        // TODO: bisogna memorizzare degli oggetti più complessi...
        $scope.ingredient_groups =
        [{
            id: "0",
            title: "",
            ingredients: [{
                name: "",
                quantity: "",
                type: ""
            }]
        }];
		
        // metodo per aggiungere banalmente un gruppo di ingredienti
        $scope.addIngredientGroup = function (index) {
            $scope.ingredient_groups
                .push({
                    id: "0",
                    title: "",
                    ingredients: [{
                        name: "",
                        quantity: "",
                        type: ""
                    }]
                });
        };
        
        $scope.removeIngredientGroup = function (index) {
            $scope.ingredient_groups.splice(index, 1);
        };

        $scope.addIngredient = function (index) {
            $scope.ingredient_groups[index].ingredients.push({
                name: "",
                quantity: "",
                type: ""
            });
        };
        
        $scope.removeIngredient = function (group_index, ingredient_index) {
            $scope.ingredient_groups[group_index].ingredients.splice(ingredient_index, 1);
        };

        

        $scope.addRecipe = function () {
            // preparo l'oggetto ricetta da spedire al server...
            var recipeToCreate = {
                title: $scope.title,
                dosagesFor: $scope.dosagesFor,
                dosagesType: $scope.selected_dosage_type,
                category: $scope.selected_category,
                description: $scope.description
            };
            console.log(recipeToCreate);

            Recipe.create(recipeToCreate, function (response) {
                $state.go('dashboard');
            });
        };
        
        // sezione da modificare
        
        $scope.users = [
            { id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin' },
            { id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip' },
            { id: 3, name: 'awesome user3', status: 2, group: null }
        ];

        $scope.statuses = [
            { value: 1, text: 'status1' },
            { value: 2, text: 'status2' },
            { value: 3, text: 'status3' },
            { value: 4, text: 'status4' }
        ];

        $scope.groups = [];
        $scope.loadGroups = function () {
            return $scope.groups.length ? null : $http.get('/groups').success(function (data) {
                $scope.groups = data;
            });
        };

        $scope.showGroup = function (user) {
            if (user.group && $scope.groups.length) {
                var selected = $filter('filter')($scope.groups, { id: user.group });
                return selected.length ? selected[0].text : 'Not set';
            } else {
                return user.groupName || 'Not set';
            }
        };

        $scope.showStatus = function (user) {
            var selected = [];
            if (user.status) {
                selected = $filter('filter')($scope.statuses, { value: user.status });
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        $scope.checkName = function (data, id) {
            if (id === 2 && data !== 'awesome') {
                return "Username 2 should be `awesome`";
            }
        };

        $scope.saveUser = function (data, id) {
            //$scope.user not updated yet
            angular.extend(data, { id: id });
            return $http.post('/saveUser', data);
        };

        // remove user
        $scope.removeUser = function (index) {
            $scope.users.splice(index, 1);
        };

        // add user
        $scope.addUser = function () {
            $scope.inserted = {
                id: $scope.users.length + 1,
                name: '',
                status: null,
                group: null
            };
            $scope.users.push($scope.inserted);
        };



    }]);