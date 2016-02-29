/**
 * assets/js/controllers/RecipeCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con le ricette.
 */
angular.module('RecipeCtrl', []).controller('RecipeCtrl', [
    '$scope',
    'Recipe',
    'Auth',
    'Collection',
    '$uibModal',
    '$log',
    '$state', // gestione degli stati dell'app (ui-router)
    'User',
    function ($scope, Recipe, Auth, Collection, $uibModal, $log, $state, User) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;
	
        // espongo allo scope le ricette del servizio Recipe
        $scope.recipes = Recipe.recipes;
        $scope.detailedRecipe = Recipe.detailedRecipe;
        
        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;
        
        /**
         * Verifica se l'utente loggatto attualmente è l'autore della ricetta.
         */
        $scope.isRecipeAuthor = function (recipe) {
            if (Auth.isLoggedIn) {
                if (Auth.currentUser().id == recipe.author.id) {
                    return true;
                }
            }
            return false;
        };

        $scope.deleteCurrentRecipe = function () {
            console.log("elimino la ricetta");
            Recipe.delete($scope.detailedRecipe.id,
                function (response) {
                    $state.go('app');
                }, function (response) {
                    // errore
                });
        };
        
        
               
        $scope.toggleUpvoteRecipe = function (recipe) {
            if (recipe.userVote == 1) {
                Recipe.deleteVote(recipe);
            } else {
                Recipe.upvote(recipe);
            }
            
        };
        
        $scope.checkVote = function (recipe) {
            Recipe.checkVote(recipe);
        };
        
        
        
        $scope.toggleTryRecipe = function (recipe) {
            if (recipe.userTry) {
                Recipe.deleteTry(recipe);
            } else {
                Recipe.createTry(recipe);
            }
            
        };

        $scope.checkTry = function (recipe) {
            Recipe.checkTry(recipe);
        };
        
        
        $scope.viewRecipe = function (recipe) {
            Recipe.createView(recipe);
        };
        
        /**
         * Inizializzazione di un dettaglio di una ricetta.
         */
        $scope.initDetailedRecipe = function (recipe) {
            Recipe.createView(recipe);
            Recipe.checkTry(recipe);
        }


        $scope.openCollectionSelectionModal = function (selectedRecipe) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_collection_selection_modal.html',
                controller: 'CollectionSelectionModalCtrl',
                // classe aggiuntiva a modal-dialog (ci imposto la dmensione) modal-add-recipe-to-collection
                size: 'add-recipe-to-collection',
                resolve: {
                    selectedRecipe: selectedRecipe,
                    collections: function () {
                        return Collection.getUserCollections(Auth.currentUser.id);
                    }
                }
            });

            modalInstance.result.then(function () {
                $log.info('Modal dismissed with success at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
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
                                setTimeout(function () {
                                    //do what you need here
                                    $scope.loading = false;
                                    $uibModalInstance.dismiss('cancel');
                                    $state.go('app');
                                }, 2000);

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
                        // todo
                        
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
        
        //funzione che restiruisce il colore bianco o nero a seonda dell'input
        $scope.textColor = function (recipe){
            //inizializzo la varibile a bianco, quindi il testo dobrebbe esseren nero.
            var c = "#FFFFFF";
            
            //recupero il colore dominante della ricetta
            c = recipe.dominantColor;
            
            //calcolo se restituire il colore bianco o nero
            c = c.substring(1);      // strip #
            var rgb = parseInt(c, 16);   // convert rrggbb to decimal
            var r = (rgb >> 16) & 0xff;  // extract red
            var g = (rgb >>  8) & 0xff;  // extract green
            var b = (rgb >>  0) & 0xff;  // extract blue

            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
            
            //return del colore
            if(luma < 40){
                //return bianco
                return "#FFFFFF";
            }else{
                //return nero
                return "#FFFFFF";
            }
        };
        
    }]);