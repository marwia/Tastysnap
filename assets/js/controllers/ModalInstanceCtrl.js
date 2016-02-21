// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

/**
 * assets/js/controllers/ModalInstanceCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller per la modale che permette l'aggiunta di una ricetta ad una raccolta.
 */
angular.module('ModalInstanceCtrl', []).controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, selectedRecipe) {

    
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    // cose aggiunte
    $scope.selectedRecipe = selectedRecipe;
});