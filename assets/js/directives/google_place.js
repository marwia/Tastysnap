/**
 * assets/js/directives/google_place.js
 *
 * Google Place Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Semplice direttiva per usare l'autocomplete di Google
 * per le posizioni (places).
 */

angular.module('sampleApp')
    .directive('googleplace', function() {
    return {
        require: 'ngModel',
        scope: {
                searchResult: '=?searchResult',
                detailedResult: '=?detailedResult'
        },
        link: function(scope, element, attrs, model) {
            var options = {
                types: ['(regions)'],
                componentRestrictions: {country: 'it'}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                var geoComponents = scope.gPlace.getPlace();
                console.info(geoComponents);
                if (geoComponents.geometry) {
                    var latitude = geoComponents.geometry.location.lat();
                    var longitude = geoComponents.geometry.location.lng();
                    var place_id = geoComponents.place_id;
                    var reference = geoComponents.reference;
                  
                    scope.$apply(function() {
                        scope.searchResult = element.val();
                        scope.detailedResult.latitude = latitude;
                        scope.detailedResult.longitude = longitude;
                        scope.detailedResult.place_id = place_id;
                        scope.detailedResult.reference = reference;
                        
                        model.$setViewValue(element.val());                
                    });
                }
            });
        }
    };
});