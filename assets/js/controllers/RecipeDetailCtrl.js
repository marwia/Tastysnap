/**
 * assets/js/controllers/RecipeDetailCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con il dettaglio di una ricetta.
 * Attenzione: si dovrebbe usare questo controller in concomitanza del suo
 * genitore (con più alto grado di gerarchia): RecipeCtrl.
 */

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
    'RecipeStep',
    'Utils',
    'Page',
    '$location',
    function ($scope, Recipe, Ingredient, Auth, Collection, $uibModal, $log, $state, User, RecipeStep, Utils, Page, $location) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;

        // espongo allo scope le ricette del servizio Recipe
        $scope.detailedRecipe = Recipe.detailedRecipe;
        $scope.isRecipeAuthor = Recipe.isRecipeAuthor;

        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;

        // serve a tenere conto del caricamento della ricetta
        $scope.loadingProgress = 0;

        $scope.formatDate = Utils.formatDate;

        $scope.deleteCurrentRecipe = function () {
            Recipe.delete($scope.detailedRecipe.id,
                function (response) {
                    $state.go('app');
                }, function (response) {
                    // errore
                });
        };

        $scope.edit = function () {
            $state.go('app.recipe_edit', { id: $scope.detailedRecipe.id });
        }

        $scope.toggleTryRecipe = function () {
            if ($scope.detailedRecipe.userTry) {
                Recipe.deleteTry($scope.detailedRecipe);
            } else {
                Recipe.createTry($scope.detailedRecipe);
            }
        };

        $scope.toggleUpvoteRecipe = function () {
            if ($scope.detailedRecipe.userVote == 1) {
                Recipe.deleteVote($scope.detailedRecipe);
            } else {
                Recipe.upvote($scope.detailedRecipe);
            }
        };

        // MODALE PER GESTIRE LA CONDIVISIONE DI UNA RICETTA

        $scope.openShareModal = function (selectedRecipe) {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_share_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.selectedRecipe = selectedRecipe;
                    // azioni possibili all'interno della modale
                    $scope.ok = function () {
                        // to do
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.cancel = function () {
                        // to do
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: ''
            });
        };

        // MODALE PER CONFERMARE L'ELIMINAZIONE DI UNA RICETTA

        $scope.openEliminationModal = function (selectedRecipe) {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_elimination_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.selectedRecipe = selectedRecipe;
                    // azioni possibili all'interno della modale
                    $scope.ok = function () {
                        $scope.loading = true

                        Recipe.delete(selectedRecipe.id,
                            function (response) {
                                //do what you need here
                                $scope.loading = false;
                                $uibModalInstance.dismiss('cancel');
                                $state.go('app.home.most_recent');

                            }, function (response) {
                                // errore
                                $scope.loading = false;
                            });
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm'
            });
        };

        // MODALE PER CONFERMARE LA SEGNALAZIONE DI UNA RICETTA

        $scope.openReportModal = function (selectedRecipe) {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_report_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.reportToCreate = {
                        notes: ""
                    };
                    $scope.selectedRecipe = selectedRecipe;
                    $scope.finish = false;
                    // azioni possibili all'interno della modale
                    $scope.ok = function () {
                        if ($scope.finish) {
                            $uibModalInstance.dismiss('cancel');
                        } else {
                            $scope.loading = true
                            console.info($scope.reportToCreate);
                            Recipe.createReport(selectedRecipe.id, $scope.reportToCreate,
                                function (response) {
                                    //do what you need here
                                    $scope.loading = false;
                                    $scope.finish = true;// sono pronto a uscire

                                    //$state.go('app.home.most_recent');

                                }, function (response) {
                                    // errore
                                    $scope.loading = false;
                                });
                        }
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'md'
            });
        };

        /**
         * Serve per formattare i nomi degli ingredienti
         */
        $scope.formatIngredientName = function (text) {
            var formatted = text.toLowerCase();
            // lettera iniziale grande
            return formatted.charAt(0).toUpperCase() + formatted.slice(1);
        }

        $scope.calculateNutrientValues = function (recipe) {
            // calcolo peso totale della ricetta
            $scope.recipeTotalWeight = Ingredient.calculateRecipeTotalWeight(recipe.ingredientGroups);

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

        /**
         * Osserva la variabile che indica il progresso del
         * caricamento di tutti i dati della ricetta.
         * Utile per eseguire dei calcoli a seguito del caricamento.
         */
        $scope.$watch("loadingProgress", function (newValue, oldValue) {
            console.info(newValue);
            if ($scope.loadingProgress >= $scope.detailedRecipe.ingredientGroups.length) {// fine del caricamento della ricetta
                $scope.calculateNutrientValues($scope.detailedRecipe);
            }
        });

        /**
         * Inizializzazione del controller
         */
        function init() {
            Recipe.checkTry($scope.detailedRecipe);
            Recipe.checkVote($scope.detailedRecipe);

            // carico i vari gruppi di ingredienti
            for (var i in $scope.detailedRecipe.ingredientGroups) {
                var group = $scope.detailedRecipe.ingredientGroups[i];
                Ingredient.getIngredientGroupIngredients(group, function () {
                    $scope.loadingProgress++;
                });
            }

            // carico i vari passi della ricetta
            RecipeStep.getRecipeSteps($scope.detailedRecipe, 30, 0);

            // Configurazione del head
            Page.title = $scope.detailedRecipe.title;
            Page.description = $scope.detailedRecipe.description;
            Page.imageUrl = $scope.detailedRecipe.coverImageUrl;
            Page.url = $location.absUrl().split('?')[0];
        }

        init();

    }]);
