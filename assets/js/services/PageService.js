/**
 * assets/js/services/PageService.js
 *
 * Mariusz Wiazowski
 *
 */

angular.module('PageService', []).factory('Page', [function(){

    // service body
    var o = {
        title: "",
        description: "",
        imageUrl: "",
        url: ""
    }

    return o;

}]);