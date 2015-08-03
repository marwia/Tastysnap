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

angular.module('sampleApp', ['ui.router', 'angular-loading-bar', 'ui.bootstrap', 'ngCookies', 'ngAnimate', 'AuthService', 'PostService', 'appRoutes', 'AuthCtrl', 'MainCtrl', 'NavCtrl', 'PostsCtrl', 'MasterCtrl']);