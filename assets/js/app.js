/**
 * Angular application 
 *
 * Il modulo "angular-loading-bar" serve a mostrare la barra di progresso ogni
 * volta che viene fatta una richiesta HTTP.
 *
 * In questa parte di codice dichiaro tutte le dipendenze relative al modulo principale chiamato "sampleApp".
 * ATTENZIONE: l'ordine è  rilevante!
 * Il primo modulo ad essere lanciato sarà 'sampleApp'
 *
 */

var myApp = angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'ngCookies', 'xeditable', 'angularFileUpload', 
				'AuthService', 'PostService', 'RecipeService', 'UserService',
				'angular-loading-bar', 'ngAnimate', 'appRoutes', 
				'AuthCtrl', 'MainCtrl', 'MasterCtrl', 'NavCtrl', 'PostsCtrl', 'SideBarCtrl',
				'RecipeCtrl', 'RecipeCreateCtrl', 'UserProfileCtrl']);
     
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