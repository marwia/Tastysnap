/**
 * assets/js/controllers/RecipeDetailCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con il dettaglio di una ricetta.
 * Attenzione: si dovrebbe usare questo controller in concomitanza del suo
 * genitore (con più alto grado di gerarchia): RecipeCtrl.
 */

angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);
angular.module('RecipeDetailCtrl', []).controller('RecipeDetailCtrl', [
    '$scope',
    'Recipe',
    'Ingredient',
    'Auth',
    'Collection',
    '$uibModal',
    '$log',
    '$state', // gestione degli stati dell'app (ui-router)
    'User',
    function($scope, Recipe, Ingredient, Auth, Collection, $uibModal, $log, $state, User) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;

        // espongo allo scope le ricette del servizio Recipe
        $scope.detailedRecipe = Recipe.detailedRecipe;
        $scope.isRecipeAuthor = Recipe.isRecipeAuthor;

        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;

        /**
        * Inizializzazione di un dettaglio di una ricetta.
        */
        $scope.initDetailedRecipe = function(recipe) {
            Recipe.createView(recipe);
            Recipe.checkTry(recipe);
            Ingredient.getIngredientGroupIngredients(recipe.ingredientGroups[0]);
        }

        $scope.deleteCurrentRecipe = function() {
            Recipe.delete($scope.detailedRecipe.id,
                function(response) {
                    $state.go('app');
                }, function(response) {
                    // errore
                });
        };

        $scope.toggleTryRecipe = function(recipe) {
            if (recipe.userTry) {
                Recipe.deleteTry(recipe);
            } else {
                Recipe.createTry(recipe);
            }

        };

        // MODALE PER CONFERMARE L'ELIMINAZIONE DI UNA RICETTA

        $scope.openEliminationModal = function(selectedRecipe) {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_elimination_modal.html',
                controller: function($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.selectedRecipe = selectedRecipe;
                    // azioni possibili all'interno della modale
                    $scope.ok = function() {
                        $scope.loading = true

                        Recipe.delete(selectedRecipe.id,
                            function(response) {
                                //do what you need here
                                $scope.loading = false;
                                $uibModalInstance.dismiss('cancel');
                                $state.go('app.home.most_recent');

                            }, function(response) {
                                // errore
                                $scope.loading = false;
                            });
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm'
            });
        };

        //mi ritorna la data leggibile
        $scope.formatDate = function(recipe) {
            moment.locale("it");
            return moment(recipe.createdAt).fromNow();
        }

        $scope.calculateNutrientValues = function(recipe) {
            // calcolo totale kcal
            recipe.totalEnergy = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '208');
            
            recipe.totalProtein = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '203');
            
            recipe.totalCarbs = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '205');
            
            recipe.totalSugar = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '269');
            
            recipe.totalFat = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '204');
            
            recipe.totalFatSat = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '606');
            
            recipe.totalWater = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '255');
            
            recipe.totalFibers = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '291');
            
            recipe.totalCalcium = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '301');
            
            recipe.totalIron = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '303');
            
            recipe.totalMag = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '304');
            
            recipe.totalPot = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '306');
            
            recipe.totalSod = Ingredient.calculateNutrientTotal(recipe.ingredientGroups, '307');

        }
        
        //Metodi per far funzionare lo slider del dettaglio della ricetta,
        // NON so se dovremmo metterlo in un conroller a parte
        //inizio carousel
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function() {
            var newWidth = 600 + slides.length + 1;
            slides.push({
            image: 'http://lorempixel.com/' + newWidth + '/300',
            text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
            id: currIndex++
            });
        };

        $scope.randomize = function() {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };

        for (var i = 0; i < 4; i++) {
            $scope.addSlide();
        }

        // Randomize logic below

        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
            slides[i].id = indexes.pop();
            }
        }

        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
            indexes[i] = i;
            }
            return shuffle(indexes);
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
            }

            return array;
        }
        //fine carousel

    }]);
