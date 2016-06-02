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
    'uiGmapGoogleMapApi',
    'uiGmapIsReady',
    '$timeout',
    function ($scope, $state, $stateParams, Recipe, Collection, User, uiGmapGoogleMapApi, IsReady, $timeout) {

        // mappa centrata sull'italia
        $scope.map = {
            center: {
                latitude: 42,
                longitude: 12
            },
            zoom: 6,
            markers: [],
            window: {
                model: {},
                closeClick: function () {
                    $scope.map.window.options.visible = false;
                },
                options: {
                    visible: true,
                    maxWidth: 350
                },
                parent: $scope
            }
        };
        
        // impostazioni generali per tutti i markers
        $scope.marker = {
            options: {
                icon: 'app_images/map_marker_icon.png'
            }
        };
        
        // metodo per avere soltanto un marker "aperto" alla volta
        $scope.toggleSelectedMarker = function(markerId) {
            if ($scope.selectedMarkerId == markerId) {
                $scope.selectedMarkerId = null;
            } else {
                $scope.selectedMarkerId = markerId;
            }
        }
        
        $scope.selectedMarkerId = undefined;

        $scope.control = {};
        $scope.currentPosition = {};

        $scope.recipes = Recipe.recipes;

        // marker della posizione corrente sulla mappa
        $scope.currentPositionMarker = {
            id: 0,
            coords: {
                latitude: null,
                longitude: null
            },
            options: { draggable: false },
            events: {
                dragend: function (marker, eventName, args) {
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

        IsReady.promise().then(function (maps) {
            var map1 = $scope.control.getGMap();
            var map2 = maps[0].map;// un altro modo per ottenere la mappa...

            /**
             * Configuro i vari listener dei spostamenti della 
             * mappa: cambio del centro e dello zoom.
             */

            map1.addListener('center_changed', function () {
                $timeout.cancel($scope.timer_1);
                $scope.timer_1 = $timeout(function () {
                    var map = $scope.control.getGMap();
                    var dis = getRadius(map);
 
                    Recipe.searchByCoordinates(
                        map.getCenter().lat(),
                        map.getCenter().lng(),
                        dis);
                }, 2000);
            });

            map1.addListener('zoom_changed', function () {
                $timeout.cancel($scope.timer_1);
                $scope.timer_1 = $timeout(function () {
                    var map = $scope.control.getGMap();
                    var dis = getRadius(map);
 
                    Recipe.searchByCoordinates(
                        map.getCenter().lat(),
                        map.getCenter().lng(),
                        dis);
                }, 2000);
            });
            
            // determinazione della posizione del client
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    // salvo la posizione corrente
                    $scope.currentPosition.latitude = position.coords.latitude;
                    $scope.currentPosition.longitude = position.coords.longitude;

                    // centro la mappa 
                    $scope.map.center.latitude = $scope.currentPosition.latitude;
                    $scope.map.center.longitude = $scope.currentPosition.longitude;
                    $scope.map.zoom = 11;

                    // aggiorno il marker sulla mappa
                    $scope.currentPositionMarker.coords = $scope.currentPosition;
                });
            }
        });

        /**
         * Funzione per calcolare il raggio 
         */
        var getRadius = function (map) {
            var bounds = map.getBounds();

            var center = bounds.getCenter();
            var ne = bounds.getNorthEast();

            // r = radius of the earth in statute miles
            var r = 3963.0;

            // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
            var lat1 = center.lat() / 57.2958;
            var lon1 = center.lng() / 57.2958;
            var lat2 = ne.lat() / 57.2958;
            var lon2 = ne.lng() / 57.2958;

            // distance = circle radius from center to Northeast corner of bounds
            var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
                
            // converto il valore da miglia a metri
            dis = dis * 1.60934 * 1000;
            
            return dis;
        };

        var init = function () {
            //....
        };
        // and fire it after definition
        init();

    }]);