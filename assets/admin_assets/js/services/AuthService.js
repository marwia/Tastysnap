/**
 * assets/admin_assets/js/services/AuthService.js
 *
 * Mariusz Wiazowski
 *
 * Service per gestire l'autenticazione.
 */
angular.module('AuthService', [])
        .factory('Auth', ['$http', '$window', function ($http, $window) {
            
    var server_prefix = '/api/v1';
        
    // service body    
    var auth = {};

    // Funzione per salvare il token in locale
    auth.saveToken = function (token) {
        $window.localStorage['tastysnap-token'] = token;
        // Imposto il header per tutte le chiamate
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    };

    // Funzione per caricare il token salvato in locale
    auth.getToken = function () {
        return $window.localStorage['tastysnap-token'];
    }

    // Funzione che verifica se esite un token e se è scaduto (non valido)
    auth.isLoggedIn = function () {
        var token = auth.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    /**
     * Funzione che verifica se l'utente è loggato (controllando se esiste
     * un valido token salvato nel browser). Se l'utente è loggato, viene
     * restituito il payload del token (che differisce dalla classe User).
     */
    auth.currentUser = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload;
        }
        return null;
    };


    auth.register = function (user) {
        return $http.post(server_prefix + '/user/create', user).then(function (response) {
            auth.saveToken(response.data.token);
        });
    };


    auth.logIn = function (user) {
        return $http.post(server_prefix + '/login', user).then(function (response) {
            auth.saveToken(response.data.token);
        });
    };

    auth.isInvitationRequired = function (successCB) {
        return $http.get(server_prefix + '/auth/invitation').then(function (response) {
            successCB(response.data);
        });
    };

    auth.getPermission = function (successCB, errorCB) {
        return $http.get(server_prefix + '/auth/permission').then(function (response) {
            
            if(successCB)
                successCB(response);
        }, errorCB);
    };

    auth.logOut = function () {
        $window.localStorage.removeItem('tastysnap-token');
    };
    
    return auth;
}]);