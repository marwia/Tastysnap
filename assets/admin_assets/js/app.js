/**
 * Angular application 
 *
 * In questa parte di codice dichiaro tutte le dipendenze relative al modulo principale chiamato "adminApp".
 * ATTENZIONE: l'ordine è rilevante!
 * Il primo modulo ad essere lanciato sarà 'adminApp'
 *
 */

var myApp = angular.module('adminApp', ['ui.router', 'ui.bootstrap', 'ngCookies',
				'AuthService', 'UserService', 'RecipeService', 'CollectionService',
                'ProductService', 'myDropdown-directive',
                'adminAppRoutes', 'UserMngmntCtrl', 'RecipeMngmntCtrl',
                'CollectionMngmntCtrl', 'ProductMngmntCtrl']);

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