/**
 * assets/js/directives/recipe_card.js
 *
 * Recipe Card Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Semplice direttiva per mostrare un card passando una ricetta come 
 * parametro. In gergo si chiama direttiva con scope isolato.
 */

angular.module('sampleApp')
    .directive('recipeCard', ['User', function (User) {
        
        return {
            restrict: 'E',
            //scope: true,
            
            scope: {
                recipe: '=recipe',
                openCollectionModal: '&',
                openShareModal: '&',
                toggleUpvoteRecipe: '&'
            },
            
            //controller: 'RecipeCtrl',
            link: function (scope, element, attrs) {
                scope.getUserProfileImage = User.getUserProfileImage;
            },
            templateUrl: 'templates/recipe_card.html'
        };
    }]);