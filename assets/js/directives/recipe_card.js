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
                showRemoveButton: '=',
                removeCallback: '&'// per la rimozione dalla raccolta
            },

            //controller: 'RecipeCtrl',
            link: function (scope, element, attrs) {
                scope.getUserProfileImage = User.getUserProfileImage;
                scope.getTextColor = Recipe.getTextColor;

                // Conteggio delle richieste, server per farne una sola
                scope.checkVoteReqCount = 0;

                scope.toggleUpvoteRecipe = function () {
                    if (scope.recipe.userVote == 1) {
                        Recipe.deleteVote(scope.recipe);
                    } else {
                        Recipe.upvote(scope.recipe);
                    }
                };

                /**
                 * Controllo se l'utente segue la raccolta
                 */
                scope.checkVote = function () {
                    if (scope.checkVoteReqCount == 0) {
                        scope.checkVoteReqCount++;
                        Recipe.checkVote(scope.recipe);
                    }
                }

                // oggetto che rappresenta lo stile del font della card
                scope.cardFontStyle = { color: scope.getTextColor(scope.recipe) };
            },
            templateUrl: 'templates/recipe_card.html'
        };
    }]);