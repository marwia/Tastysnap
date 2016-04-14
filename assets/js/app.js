/**
 * Angular application 
 *
 * In questa parte di codice dichiaro tutte le dipendenze relative al modulo principale chiamato "sampleApp".
 * ATTENZIONE: l'ordine è rilevante!
 * Il primo modulo ad essere lanciato sarà 'sampleApp'
 *
 */

var myApp = angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'ngCookies', 'xeditable', 'angularFileUpload',
                'toaster', 'ngMessages', 'uiGmapgoogle-maps',
				'AuthService', 'PostService', 'RecipeService', 'UserService', 'CollectionService', 'ProductService',
                'IngredientService', 'CommentService', 'RecipeStepService', 'RecipeReviewService', 'ImageUtilsService',
				'ngAnimate', 'appRoutes', 
				'AuthCtrl', 'MasterCtrl', 'NavCtrl', 'SideBarCtrl',
				'RecipeCtrl', 'RecipeDetailCtrl', 'RecipeCreateCtrl', 'UserProfileCtrl', 'UserHomeCtrl', 'CollectionCtrl',
                'CollectionSelectionModalCtrl', 'CollectionDetailCtrl', 'CommentCtrl', 'SearchCtrl',
                'UserProfileFollowerUsersCtrl', 'UserProfileFollowingUsersCtrl', 'NearRecipesCtrl', 'FollowingCollectionsCtrl',
                'RecipeReviewCtrl']);
     
// funzione che parte all'avvio dell'app
// Serve per ricevere il token CSRF una volta sola        
myApp.run(function($http) {
    // change site
    $http.get('csrfToken').success(function(data){
        console.log(data);
        $http.defaults.headers.common['x-csrf-token'] = data._csrf;
        $http.defaults.withCredentials = true;
        });
});

myApp.config(['$animateProvider', 'uiGmapGoogleMapApiProvider', function($animateProvider, uiGmapGoogleMapApiProvider){
  // restrict animation to elements with the bi-animate css class with a regexp.
  // note: "bi-*" is our css namespace at @Bringr.
  $animateProvider.classNameFilter(/^((?!(fa-spinner)).)*$/);
  //$animateProvider.classNameFilter(/^((?!(fa-spinner|class2|class3)).)*$/);
  
  // Configurazione delle Google Maps API
  uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
    
}]);