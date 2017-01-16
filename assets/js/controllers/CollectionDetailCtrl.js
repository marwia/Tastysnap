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
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/collection_edit_modal.html',
                controller: 'CollectionEditModalCtrl',
                resolve: {
                    // passaggio dei parametri
                    selectedCollection: $scope.detailedCollection
                },
                size: 'lg'
            });

            // aggiorno i risultati
            modalInstance.result.then(function (collection) {
                $scope.detailedCollection = collection;
            });

        };

        // MODALE PER GESTIRE LA CONDIVISIONE DI UNA RICETTA

        $scope.openShareModal = function () {
            var selectedCollection = $scope.detailedCollection;
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/collection_share_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.selectedCollection = selectedCollection;
                    console.info("selectedCollection", selectedCollection);
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

        

        /**
         * Codice per individuare quando mostrare il titolo della 
         * ricetta sulla seconda navbar, ovvero quando questa navbar
         * avrà raggiunto la cima.
         */
        var element = angular.element( document.querySelector( '#collection_nav' ) );
        var offsetTop = element.prop('offsetTop');
        $scope.showUpArrow = true;

        $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();
            var oldState = $scope.showUpArrow;
            if (scroll >= offsetTop || scroll == undefined) {
                $scope.showUpArrow = false;
            } else {
                $scope.showUpArrow = true;
            }
            if ($scope.showUpArrow !== oldState) {
                $scope.$apply();
            }
        });

        /**
         * Inizializzazione del controller:
         */

        var init = function () {
            Collection.createView($scope.detailedCollection);
            Collection.getDetailedCollectionRecipes(function (response) {

                $scope.randomRecipe = Collection.getRandomCoverBlurredImage($scope.detailedCollection);
            });

            Collection.areYouFollowing($scope.detailedCollection, $scope.toggleAction());
        };
        // and fire it after definition
        init();

    }]);