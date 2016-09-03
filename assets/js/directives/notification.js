/**
 * assets/js/directives/notification.js
 *
 * Notification Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Semplice direttiva per mostrare una notifica passando l'elemento come 
 * parametro. In gergo si chiama direttiva con scope isolato.
 */

angular.module('sampleApp')
    .directive('notification', ['User', 'Recipe', 'Collection', 'Notification', 'Utils', function (User, Recipe, Collection, Notification, Utils) {

        return {
            restrict: 'E',
            //scope: true,

            scope: {
                notification: '='
            },

            //controller: 'RecipeCtrl',
            link: function (scope, element, attrs) {
                scope.getUserProfileImage = User.getUserProfileImage;

                scope.formatDate = Utils.formatDate;

                // indica se devo nascondere una notifica non più valida
                scope.hide = false;

                scope.message = {
                    'VoteComment': 'ha espresso un giudizio ad un tuo commento',
                    'FollowUser': 'ha iniziato a seguirti',
                    'FollowCollection': 'ha iniziato a seguire la raccolta',
                    'Collection': 'ha creato la raccolta',
                    'CollectionRecipe': 'ha aggiunta una nuova ricetta alla raccolta',
                    'Comment': 'ha commentato la ricetta',
                    'Recipe': 'ha creato la ricetta',
                    'ReviewRecipe': 'ha recensito la ricetta',
                    'TryRecipe': 'ha assaggiato la ricetta',
                    'VoteRecipe': 'ha aggiunto ai preferiti la ricetta'
                };

                scope.object = "";
                scope.objectLink = "#";

                switch (scope.notification.type) {
                    case 'CollectionRecipe':
                    case 'FollowCollection':
                    case 'Collection':
                        // trova raccolta
                        if (typeof scope.notification.event.collection === 'string') {
                            Collection.searchById(scope.notification.event.collection, function success(response) {
                                console.log("caricato");
                                scope.object = response.data[0].title;
                                scope.notification.event.collection = response.data[0];
                                scope.objectLink = "/app/collection/" + response.data[0].id;
                            }, function error(response) {
                                // probabilmente la notifica non è più "integra"
                                scope.hide = true;
                            });
                        }
                        else {
                            scope.object = scope.notification.event.title;
                            scope.objectLink = "/app/collection/" + scope.notification.event.id;
                        }
                        break;
 
                    case 'Comment':
                    case 'ReviewRecipe':
                    case 'TryRecipe':
                    case 'VoteRecipe':
                        // trova ricetta
                        if (typeof scope.notification.event.recipe === 'string')
                            Recipe.searchById(scope.notification.event.recipe, function success(response) {
                                scope.object = response.data[0].title;
                                scope.notification.event.recipe = response.data[0];
                                scope.objectLink = "/app/recipe/" + response.data[0].id;
                            });
                        break;
                    case 'Recipe':
                        scope.object = scope.notification.event.title;
                        scope.objectLink = "/app/recipe/" + scope.notification.event.id;
                        break;
                    
                }

                scope.setRed = function (notification) {
                    Notification.setRed([notification.id], function (response) {
                        notification.red = true;
                    });
                };
            },
            templateUrl: 'templates/notification.html'
        };
    }]);