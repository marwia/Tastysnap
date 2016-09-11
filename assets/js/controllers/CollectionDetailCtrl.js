/**
 * assets/js/controllers/CollectionDetailCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con il dettaglio di una ricetta.
 * Attenzione: si dovrebbe usare questo controller in concomitanza del suo
 * genitore (con più alto grado di gerarchia): RecipeCtrl.
 */
angular.module('CollectionDetailCtrl', []).controller('CollectionDetailCtrl', [
    '$scope',
    'Recipe',
    'Auth',
    'Collection',
    '$uibModal',
    '$log',
    '$state', // gestione degli stati dell'app (ui-router)
    'User',
    'toastr',
    function ($scope, Recipe, Auth, Collection, $uibModal, $log, $state, User, toastr) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;

        // espongo allo scope le collection del servizio Collection
        $scope.detailedCollection = Collection.detailedCollection;
        $scope.isCollectionAuthor = Collection.isCollectionAuthor;

        $scope.getTextColor = Recipe.getTextColor;

        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;

        $scope.formatDate = function (collection) {
            moment.locale("it");
            return moment(collection.createdAt).fromNow();
        };

        /**
         * Gestione pulsante per modificare le ricette della raccolta:
         */
        $scope.recipeRemoveOn = false;

        /**
         * Funzione per gestire l'eliminazione di una ricetta da una raccolta
         * 
         */
        $scope.removeRecipe = function (recipe) {
            Collection.removeRecipeFromCollection(
                recipe, $scope.detailedCollection, function (response) {
                    // rimuovo la ricetta dall'array
                    var recipeIdx = $scope.detailedCollection.recipes.indexOf(recipe);
                    $scope.detailedCollection.recipes.splice(recipeIdx, 1);

                    toastr.success('Ricetta rimossa');
                })
        }

        /**
         * Gestione del pulsante per seguire la raccolta:
         */

        // Testo sul pulsante per seguire una raccolta
        $scope.action = "SEGUI RACCOLTA";

        $scope.toggleFollow = function (collection) {
            if (collection.isFollowed == true) {
                Collection.unfollow($scope.detailedCollection, function () {
                    //fatto
                })
            } else {
                Collection.follow($scope.detailedCollection, function () {
                    //fatto
                })
            }
        }

        $scope.onMouseEnter = function () {
            if ($scope.detailedCollection.isFollowed == true) {
                $scope.action = "SMETTI DI SEGUIRE";
            }
        }

        $scope.toggleAction = function () {
            $scope.action = "";
        }

        /**
         * Modale per modificare il titolo o la descrizione della raccolta
         */

        $scope.openEditModal = function () {
            var collection = $scope.detailedCollection;
            var openEliminationModal = $scope.openEliminationModal;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/collection_edit_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.collection = angular.copy(collection);

                    console.info("scope", $scope);

                    // azioni possibili all'interno della modale

                    // salva
                    $scope.ok = function () {
                        $scope.loading = true;

                        Collection.update($scope.collection,
                            function (response) {
                                //do what you need here
                                $scope.loading = false;

                                // aggiorno le modifiche e chiudo
                                $uibModalInstance.close($scope.collection);

                            }, function (response) {
                                // errore
                                $scope.loading = false;
                            });
                    };

                    // annulla
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    // elimina raccolta
                    $scope.delete = function () {
                        var eliminationModalInstance = openEliminationModal();

                        // attendo la conferma dell'eliminazione'
                        eliminationModalInstance.result.then(function (result) {
                            toastr.success('Raccolta eliminata');

                            // chiudo la modale corrente
                            $uibModalInstance.dismiss('cancel');
                            // cambio stato
                            $state.go('app.home.most_recent');
                        });
                    }
                },
                size: 'lg'
            });

            // aggiorno i risultati
            modalInstance.result.then(function (collection) {
                $scope.detailedCollection = collection;
            });

        };

        /**
         * Modale per eliminare una raccolta
         */

        $scope.openEliminationModal = function () {
            var collection = $scope.detailedCollection;
            return $uibModal.open({
                animation: true,
                templateUrl: 'templates/collection_elimination_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.collection = collection;
                    // azioni possibili all'interno della modale
                    $scope.ok = function () {
                        $scope.loading = true;

                        Collection.delete(collection.id,
                            function (response) {
                                //do what you need here
                                $scope.loading = false;
                                $uibModalInstance.close(true);

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

        /**
         * Inizializzazione del controller:
         */

        var init = function () {
            Collection.createView($scope.detailedCollection);
            Collection.getDetailedCollectionRecipes(function (response) {

                 $scope.randomRecipe = Collection.getRandomCoverBlurredImage($scope.detailedCollection);
                 $scope.randomBlurredImage
            });

            Collection.areYouFollowing($scope.detailedCollection, $scope.toggleAction());
        };
        // and fire it after definition
        init();

    }]);