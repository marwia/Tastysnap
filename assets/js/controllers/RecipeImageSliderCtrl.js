/**
 * assets/js/controllers/RecipeImageSliderCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per governare lo slider delle immagini di una ricetta.
 */
angular.module('RecipeImageSliderCtrl', []).controller('RecipeImageSliderCtrl', [
    '$scope',
    function ($scope) {
        
        //Metodi per far funzionare lo slider del dettaglio della ricetta,
        // NON so se dovremmo metterlo in un conroller a parte
        //inizio carousel
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function(imageUrl) {
            slides.push({
                image: imageUrl,
                text: "",
                id: currIndex++
            });
        };

        $scope.randomize = function() {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };
        
        // inizializzazione dello slider
        var init = function () {
            
            $scope.addSlide($scope.detailedRecipe.coverImageUrl);
            
            if ($scope.detailedRecipe.otherImageUrls)
            for (var i = 0; i < $scope.detailedRecipe.otherImageUrls.length; i++) {
                $scope.addSlide($scope.detailedRecipe.otherImageUrls[i]);
            }
        };
        
        init();
    }]);