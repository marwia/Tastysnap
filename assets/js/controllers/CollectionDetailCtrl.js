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
    function ($scope, Recipe, Auth, Collection, $uibModal, $log, $state, User) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;
        
        // espongo allo scope le collection del servizio Collection
        $scope.detailedCollection = Collection.detailedCollection;
        
        // espongo i metodi del servizio User
        $scope.getUserProfileImage = User.getUserProfileImage;
        
        //ricavo un immagine casuale di una ricetta per metterla come sfondo
        $scope.getRandomCoverBlurredImage = Collection.getRandomCoverBlurredImage;
        
        $scope.formatDate = function (collection) {
            moment.locale("it");
            return moment(collection.createdAt).fromNow();
        };
        
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
         * Inizializzazione del controller:
         */
        
        var init = function () {
            Collection.createView($scope.detailedCollection);
            Collection.getDetailedCollectionRecipes();
            Collection.areYouFollowing($scope.detailedCollection, $scope.toggleAction());
        };
        // and fire it after definition
        init();

    }]);