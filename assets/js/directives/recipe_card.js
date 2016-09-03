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
    .directive('recipeCard', ['User', 'Recipe', function (User, Recipe) {
        
        return {
            restrict: 'E',
            //scope: true,
            
            scope: {
                recipe: '=recipe',
                openCollectionModal: '&',
                openShareModal: '&',
                toggleUpvoteRecipe: '&',
                showRemoveButton: '=',
                removeCallback: '&'// per la rimozione dalla raccolta
            },
            
            //controller: 'RecipeCtrl',
            link: function (scope, element, attrs) {
                scope.getUserProfileImage = User.getUserProfileImage;
                scope.getTextColor = Recipe.getTextColor;
                
                // oggetto che rappresenta lo stile del font della card
                scope.cardFontStyle = {color: scope.getTextColor(scope.recipe)};
            },
            templateUrl: 'templates/recipe_card.html'
        };
    }]);