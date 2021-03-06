/**
 * Angular application 
 *
 * In questa parte di codice dichiaro tutte le dipendenze relative al modulo principale chiamato "sampleApp".
 * ATTENZIONE: l'ordine è rilevante!
 * Il primo modulo ad essere lanciato sarà 'sampleApp'
 *
 */

var myApp = angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'ngCookies', 'xeditable', 'angularFileUpload',
                'ngMessages', 'uiGmapgoogle-maps', 'angular-spinkit', 'angular.filter', 'ngSails', 'infinite-scroll',
                'myDropdown-directive',
				'AuthService', 'PostService', 'RecipeService', 'UserService', 'CollectionService', 'ProductService',
                'IngredientService', 'CommentService', 'RecipeStepService', 'RecipeReviewService', 'ImageUtilsService',
                'NotificationService', 'ActivityService', 'Utils', 'SearchService', 'PageService', 'UserEngagementService',
				'ngAnimate', 'appRoutes', 'toastr', 'rzModule', 'angular-click-outside', 'ngGPlaces', 'angular-timeline',
				'AuthCtrl', 'MasterCtrl', 'NavCtrl', 'SideBarCtrl',
				'RecipeCtrl', 'RecipeDetailCtrl', 'RecipeCreateCtrl', 'UserProfileCtrl', 'UserHomeCtrl', 'CollectionCtrl',
                'CollectionSelectionModalCtrl', 'CollectionDetailCtrl', 'CommentCtrl', 'ExtHomeCtrl',
                'SearchCtrl', 'SearchRecipeCtrl', 'SearchCollectionCtrl', 'SimilarRecipeCtrl',
                'UserProfileFollowerUsersCtrl', 'UserProfileFollowingUsersCtrl', 'NearRecipesCtrl', 'FollowingCollectionsCtrl',
                'RecipeReviewCtrl', 'RecipeImageSliderCtrl', 'NotificationCtrl', 'ActivitesCtrl',
                'CollectionEditModalCtrl', 'HeadCtrl', 'BodyCtrl']);

/**
 * Configurazione iniziale dell'app, viene fatta una sola volta all'avvio.
 */     
myApp.run(function($http, $rootScope, Auth) {
    
    /**
     * Serve per ricevere il token CSRF una volta sola e lo imposta
     * per ogni chiamata successiva.
     */
    $http.get('csrfToken').then(function(response){
        $http.defaults.headers.common['x-csrf-token'] = response.data._csrf;
        $http.defaults.withCredentials = true;
    });
    
    /**
     * Serve per impostare il header per tutte le chiamate.
     */
    if (Auth.getToken()) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + Auth.getToken();
    }
    
    /**
     * Serve a configurare correttamente lo scrolling del ui-router.
     * Infatti senza di questo codice, ui-router tende a ricordarsi la
     * posizione e questo peggiora l'eserienza utente. Nel nostro
     * caso nemmeno autoscroll="true" risolve il problema.
     */
    $rootScope.$on('$stateChangeSuccess', function() {
        // eseguo uno scroll al top assoluto
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
});

myApp.config(['$animateProvider', 'uiGmapGoogleMapApiProvider', '$sailsProvider', function($animateProvider, uiGmapGoogleMapApiProvider, $sailsProvider){
  // restrict animation to elements with the bi-animate css class with a regexp.
  // note: "bi-*" is our css namespace at @Bringr.
  $animateProvider.classNameFilter(/^((?!(fa-spinner)).)*$/);
  //$animateProvider.classNameFilter(/^((?!(fa-spinner|class2|class3)).)*$/);
  
  // Configurazione delle Google Maps API
  uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCpj_s-hKfb1dpG__r68JBgTBHNqT4dIb8',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'geometry,visualization',
        language: "it-IT"
    });
    
}]);

/**
 * Configurazione della posizione di default di tutti i toast.
 */
myApp.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    positionClass: 'toast-top-center',
  });
});