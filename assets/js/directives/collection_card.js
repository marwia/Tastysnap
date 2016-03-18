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
                
                /**
                 * Inizializzazione del controller
                 */
                Collection.getCollectionRecipes(scope.collection, 4, 0);
            },
            templateUrl: 'templates/collection_card.html'
        };
    }]);