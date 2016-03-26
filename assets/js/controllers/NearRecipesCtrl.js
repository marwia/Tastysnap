/**
 * assets/js/controllers/NearRecipesCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per esporre le funzioni di servizio di autenticazione.
 * Questo espone nello scope l'oggetto user e due metodi per fare il login
 * o la registrazione.
 */
angular.module('NearRecipesCtrl', []).controller('NearRecipesCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'Recipe',
    'Collection',
    'User',
    function($scope, $state, $stateParams, Recipe, Collection, User) {

        // mappa centrata sull'italia
        $scope.map = { center: { latitude: 42, longitude: 12 }, zoom: 6 };
        $scope.currentPosition = {};

        // marker della posizione corrente sulla mappa
        $scope.currentPositionMarker = {
            id: 0,
            coords: {
                latitude: null,
                longitude: null
            },
            options: { draggable: false },
            events: {
                dragend: function(marker, eventName, args) {
                    $log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    $log.log(lat);
                    $log.log(lon);

                    $scope.marker.options = {
                        draggable: true,
                        labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                        labelAnchor: "100 0",
                        labelClass: "marker-labels"
                    };
                }
            }
        };


        var init = function() {
            // inizializzazione del controller
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    // salvo la posizione corrente
                    $scope.currentPosition.latitude = position.coords.latitude;
                    $scope.currentPosition.longitude = position.coords.longitude;
                    
                    // aggiorno il marker sulla mappa
                    $scope.currentPositionMarker.coords = $scope.currentPosition;
                    
                });
            }
        };
        // and fire it after definition
        init();

    }]);