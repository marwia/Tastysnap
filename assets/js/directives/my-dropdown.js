/**
 * MyDropdown Directive
 * Ecco una direttiva di angular che si occupa di creare un
 * menu dropdown secondo le specifiche di Bootstrap e lo fa
 * comportare come una select box.
 */

angular
    .module('myDropdown-directive', [])
    .directive('myDropdown', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            items: '=dropdownData',
            doSelect: '&selectVal',
            selectedItem: '=preselectedItem'
        },
        link: function (scope, element, attrs) {
            var html = '';
            switch (attrs.menuType) {     
                case "button_sm":
                    html += '<div uib-dropdown class="btn-group"><button type="button" class="btn btn-sm btn-default" uib-dropdown-toggle>Seleziona <span class="caret"></span></button>';
                    break;
                case "button":
                    html += '<div uib-dropdown class="btn-group"><button type="button" class="btn btn-default" uib-dropdown-toggle>Seleziona <span class="caret"></span></button>';
                    break;
                default:
                    html += '<div uib-dropdown><a uib-dropdown-toggle role="button" data-toggle="dropdown" href="javascript:;">Dropdown<b class="caret"></b></a>';
                    break;
            }
            html += '<ul uib-dropdown-menu role="menu"><li role="menuitem" ng-repeat="item in items"><a href="#" tabindex="-1" data-ng-click="selectVal(item)">{{item}}</a></li></ul></div>';
            element.append($compile(html)(scope));
            if (scope.items)
                for (var i = 0; i < scope.items.length; i++) {
                    if (scope.items[i] === scope.selectedItem) {
                        scope.bSelectedItem = scope.items[i];
                        break;
                    }
                }
            scope.selectVal = function (item) {
                switch (attrs.menuType) {
                    case "button_sm":
                        $('button.dropdown-toggle', element).html(item + ' <span class="caret"></span> ');
                        break;
                    case "button":
                        $('button.dropdown-toggle', element).html(item + ' <span class="caret"></span> ');
                        break;
                    default:
                        $('a.dropdown-toggle', element).html('<b class="caret"></b> ' + item);
                        break;
                }
                scope.doSelect({
                    selectedVal: item
                });
            };
            scope.selectVal(scope.bSelectedItem);
        }
    };
});