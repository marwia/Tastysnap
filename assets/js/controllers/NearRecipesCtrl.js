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
            var map2 = maps[0].map;

            //alert(map1 === map2);

            map1.addListener('center_changed', function () {
                $timeout.cancel($scope.timer_1);
                $scope.timer_1 = $timeout(function () {
                    // 3 seconds after the center of the map has changed, pan back to the
                    // marker.
                    var map = $scope.control.getGMap();
                    console.log("center_changed");
                    console.info(map.getCenter())
                    var dis = getRadius(map);
                    // converto da miglia in metri
                    console.log(dis);
                    dis = dis * 1.60934 * 1000;
                    console.log("dis: ", dis);

                    Recipe.searchByCoordinates(
                        map.getCenter().lat(),
                        map.getCenter().lng(),
                        dis);
                }, 2000);


            });

            map1.addListener('zoom_changed', function () {
                // 3 seconds after the center of the map has changed, pan back to the
                // marker.
                var map = $scope.control.getGMap();
                console.log("zoom_changed");
                console.log(getRadius(map));
            });
        });

        // osservo le ricette e quindi i risultati della ricerca
        $scope.$watch("recipes", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                updateRecipeList();
                // raggruppo le ricette per posizione
                
            }


        }, true);
        
        $scope.list = [
        {id: 1, content: "This is first item"},
        {id: 2, content: "This is second item"},
        {id: 3, content: "This is third item"}
      ];
      
      $scope.windowParams = {
        list: $scope.list,
        doIt: function() {
          return $scope.doIt()
        }
      };

        
        var updateRecipeList = function () {
            console.log("lista ricette aggiornata");
            console.info($scope.recipes);
            $scope.map.markers = [];
            $scope.recipes.forEach(function (recipe) {
                var marker = {
                    id: recipe._id,
                    coords: {
                        latitude: recipe.coordinates[1],
                        longitude: recipe.coordinates[0]
                    },
                    options: {
                        label: "label",
                        title: "title",
                        draggable: false,
                        labelContent: recipe.title,
                        labelAnchor: "100 0",
                        labelClass: "marker-labels"
                    }
                };
                //var map = $scope.control.getGMap();
                $scope.map.markers.push(marker);
            });
            $scope.$apply();
        };

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

            return dis;
        };

        // uiGmapGoogleMapApi is a promise.
        // The "then" callback function provides the google.maps object.
        uiGmapGoogleMapApi.then(function (maps) {
            console.log("maps loaded");
        });

        var init = function () {
            // inizializzazione del controller
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
        };
        // and fire it after definition
        init();

    }]);