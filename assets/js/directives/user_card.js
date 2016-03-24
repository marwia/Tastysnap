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
                scope.getUserProfileImage = User.getUserProfileImage;
                
                /**
                 * Inizializzazione del controller
                 */
                //niente
            },
            templateUrl: 'templates/user_card.html'
        };
    }]);