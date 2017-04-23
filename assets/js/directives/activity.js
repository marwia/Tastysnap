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
                    'FollowUser': 'Hai iniziato a seguire',
                    'FollowCollection': 'Hai iniziato a seguire la raccolta',
                    'Collection': 'Hai creato la raccolta',
                    'CollectionRecipe': 'Hai aggiunta una nuova ricetta alla raccolta',
                    'Comment': 'Hai commentato la ricetta',
                    'Recipe': 'Hai creato la ricetta',
                    'ReviewRecipe': 'Hai recensito la ricetta',
                    'TryRecipe': 'Hai assaggiato la ricetta',
                    'VoteRecipe': 'Hai aggiunto ai preferiti la ricetta'
                };

                scope.badgeIconClass = {
                    'VoteComment': 'fa fa-thumbs-o-up',
                    'FollowUser': 'glyphicon glyphicon-user',
                    'FollowCollection': 'fa fa-heart',
                    'Collection': 'glyphicon glyphicon-th-large',
                    'CollectionRecipe': 'glyphicon glyphicon-plus',
                    'Comment': 'fa fa-comment',
                    'Recipe': 'glyphicon glyphicon-list-alt',
                    'ReviewRecipe': 'glyphicon glyphicon-star',
                    'TryRecipe': 'fa fa-cutlery',
                    'VoteRecipe': 'fa fa-heart'
                };

                scope.badgeClass = {
                    'VoteComment': 'info',
                    'FollowUser': 'warning',
                    'FollowCollection': 'danger',
                    'Collection': 'danger',
                    'CollectionRecipe': 'danger',
                    'Comment': 'info',
                    'Recipe': 'warning',
                    'ReviewRecipe': 'info',
                    'TryRecipe': 'info',
                    'VoteRecipe': 'info'
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
                    case 'FollowUser':
                        // trova utente
                        if (typeof scope.activity.event.following === 'string') {   
                            User.searchById(scope.activity.event.following, function success(response) {
                                scope.object = response.data[0].name + " " + response.data[0].surname;
                                scope.activity.event.collection = response.data[0];
                                scope.objectLink = "/app/user/" + response.data[0].id;
                            }, function error(response) {
                                // probabilmente la notifica non è più "integra"
                                scope.hide = true;
                            });
                        }
                        else {
                            scope.object = scope.activity.event.title;
                            scope.objectLink = "/app/user/" + scope.activity.event.id;
                        }
                        break;

                }

            },
            templateUrl: 'templates/activity.html'
        };
    }]);