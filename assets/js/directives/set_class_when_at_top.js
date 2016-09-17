/**
 * assets/js/directives/set_class_when_at_top.js
 *
 * Set Class When At Top Directive
 * (c) Mariusz Wiazowski 2016
 *
 * Fonte: http://stackoverflow.com/questions/27211881/how-to-fix-an-element-after-scroll-in-an-angularjs-webpage
 */

angular.module('sampleApp')
    .directive('setClassWhenAtTop', function ($window) {

    var $win = angular.element($window); // wrap window object as jQuery object

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
                topPadding = parseInt(attrs.paddingWhenAtTop, 10),
                offsetTop = element.prop('offsetTop'); // get element's offset top relative to document

            var initialOffSet = 0;
            if (attrs.addOffset)
                initialOffSet = parseInt(attrs.addOffset, 10);
                
            $win.on('scroll', function (e) {
                if ($window.pageYOffset + topPadding >= offsetTop + initialOffSet) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
});