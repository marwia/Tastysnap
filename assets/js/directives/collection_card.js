/**
 * assets/js/directives/collection_card.js
 *
 * Recipe Card Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Semplice direttiva per mostrare un collection card passando una collection come 
 * parametro. In gergo si chiama direttiva con scope isolato.
 */

angular.module('sampleApp')
    .directive('collectionCard', ['User', 'Collection', function (User, Collection) {

        return {
            restrict: 'E',
            //scope: true,

            scope: {
                collection: '=collection',
            },

            //controller: 'CollectionCtrl',
            link: function (scope, element, attrs) {
                scope.getUserProfileImage = User.getUserProfileImage;

                // Conteggio delle richieste, server per farne una sola
                scope.areYouFollowingReqCount = 0;

                scope.toggleFollow = function () {
                    if (scope.collection.isFollowed == true) {
                        Collection.unfollow(scope.collection, function () {
                            //fatto
                            collection.isFollowed = true;
                        })
                    } else {
                        Collection.follow(scope.collection, function () {
                            //fatto
                            collection.isFollowed = false;
                        })
                    }
                }

                /**
                 * Inizializzazione del controller
                 */
                Collection.getCollectionRecipes(scope.collection, 4, 0);

                /**
                 * Controllo se l'utente segue la raccolta
                 */
                scope.areYouFollowing = function () {
                    if (scope.areYouFollowingReqCount == 0) {
                        scope.areYouFollowingReqCount++;
                        Collection.areYouFollowing(scope.collection);
                    }
                }
                
            },
            templateUrl: 'templates/collection_card.html'
        };
    }]);