/**
 * assets/js/directives/activity.js
 *
 * Activity Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Semplice direttiva per mostrare una notifica passando l'elemento come 
 * parametro. In gergo si chiama direttiva con scope isolato.
 */

angular.module('sampleApp')
    .directive('activity', ['User', 'Recipe', 'Collection', 'Activity', 'Utils', function (User, Recipe, Collection, Activity, Utils) {

        return {
            restrict: 'E',
            //scope: true,

            scope: {
                activity: '='
            },

            //controller: 'RecipeCtrl',
            link: function (scope, element, attrs) {
                scope.getUserProfileImage = User.getUserProfileImage;

                scope.formatDate = Utils.formatDate;

                // indica se devo nascondere una notifica non più valida
                scope.hide = false;

                scope.message = {
                    'VoteComment': 'Hai espresso un giudizio ad un tuo commento',
                    'FollowUser': 'Hai iniziato a seguirti',
                    'FollowCollection': 'Hai iniziato a seguire la raccolta',
                    'Collection': 'Hai creato la raccolta',
                    'CollectionRecipe': 'Hai aggiunta una nuova ricetta alla raccolta',
                    'Comment': 'Hai commentato la ricetta',
                    'Recipe': 'Hai creato la ricetta',
                    'ReviewRecipe': 'Hai recensito la ricetta',
                    'TryRecipe': 'Hai assaggiato la ricetta',
                    'VoteRecipe': 'Hai aggiunto ai preferiti la ricetta'
                };

                scope.object = "";
                scope.objectLink = "#";

                switch (scope.activity.type) {
                    case 'CollectionRecipe':
                    case 'FollowCollection':
                    case 'Collection':
                        // trova raccolta
                        if (typeof scope.activity.event.collection === 'string') {
                            Collection.searchById(scope.activity.event.collection, function success(response) {
                                console.log("caricato");
                                scope.object = response.data[0].title;
                                scope.activity.event.collection = response.data[0];
                                scope.objectLink = "/app/collection/" + response.data[0].id;
                            }, function error(response) {
                                // probabilmente la notifica non è più "integra"
                                scope.hide = true;
                            });
                        }
                        else {
                            scope.object = scope.activity.event.title;
                            scope.objectLink = "/app/collection/" + scope.activity.event.id;
                        }
                        break;
 
                    case 'Comment':
                    case 'ReviewRecipe':
                    case 'TryRecipe':
                    case 'VoteRecipe':
                        // trova ricetta
                        if (typeof scope.activity.event.recipe === 'string')
                            Recipe.searchById(scope.activity.event.recipe, function success(response) {
                                scope.object = response.data[0].title;
                                scope.activity.event.recipe = response.data[0];
                                scope.objectLink = "/app/recipe/" + response.data[0].id;
                            });
                        break;
                    case 'Recipe':
                        scope.object = scope.activity.event.title;
                        scope.objectLink = "/app/recipe/" + scope.activity.event.id;
                        break;
                    
                }

                scope.setRed = function (activity) {
                    activity.setRed([activity.id], function (response) {
                        activity.red = true;
                    });
                };
            },
            templateUrl: 'templates/activity.html'
        };
    }]);