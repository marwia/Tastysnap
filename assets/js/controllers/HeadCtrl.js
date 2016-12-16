/**
 * assets/js/controllers/HeadCtrl.js
 *
 * Mariusz Wiazowski
 *
 */

angular.module('HeadCtrl', []).controller('HeadCtrl', [
    '$scope',
    'Page',
    function ($scope, Page) {

        $scope.Page = Page;

    }]);