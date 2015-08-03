/**
 * Angular application 
 *
 * Il modulo "angular-loading-bar" serve a mostrare la barra di progresso ogni
 * volta che viene fatta una richiesta HTTP.
 *
 * In questa parte di codice dichiaro tutte le dipendenze relative al modulo principale chiamato "sampleApp".
 * ATTENZIONE: l'ordine potrebbe essere rilevante!
 *
 */

angular.module('sampleApp', ['ui.router', 'ui.bootstrap', 'ngCookies', 'AuthService', 'PostService', 'angular-loading-bar', 'ngAnimate', 'appRoutes', 'AuthCtrl', 'MainCtrl', 'MasterCtrl', 'NavCtrl', 'PostsCtrl']);