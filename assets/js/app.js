/**
 * Angular application 
 *
 * Il modulo "angular-loading-bar" serve a mostrare la barra di progresso ogni
 * volta che viene fatta una richiesta HTTP.
 *
 */

angular.module('sampleApp', ['ui.router', 'angular-loading-bar', 'ui.bootstrap', 'ngCookies', 'ngAnimate', 'appRoutes', 'AuthCtrl', 'MainCtrl', 'NavCtrl', 'PostsCtrl', 'AuthService', 'PostService', 'MasterCtrl']);