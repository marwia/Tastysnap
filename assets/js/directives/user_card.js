/**
 * assets/js/directives/user_card.js
 *
 * User Card Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Semplice direttiva per mostrare un user card passando un utente come 
 * parametro. In gergo si chiama direttiva con scope isolato.
 */

angular.module('sampleApp')
    .directive('userCard', ['User', function (User) {
        
        return {
            restrict: 'E',
            //scope: true,
            
            scope: {
                user: '=user',
            },
            
            link: function (scope, element, attrs) {
                scope.currentUser = User.currentUser;
                scope.getUserProfileImage = User.getUserProfileImage;

                // devo passare l'oggeto user in una funzione per problemi di scope sulle ng-repeat
                scope.onClick = function() {
                    //devo invertirlo per motivi tecnici legati al uib-btn-checkbox
                    scope.user.isFollowed = !scope.user.isFollowed;
                    User.toggleFollow(scope.user);
                };

                scope.isFollowed = function() {
                    return scope.user.isFollowed;
                }

                /**
                 * Inizializzazione del controller
                 */
                User.areYouFollowing(scope.user, function() {
                    scope.user.isFollowed = true;
                }, function() {
                    scope.user.isFollowed = false;
                });
            },
            templateUrl: 'templates/user_card.html'
        };
    }]);