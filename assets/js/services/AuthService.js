// assets/js/services/AuthService.js
// Dichiaro un service per gestire l'autenticazione



angular.module('AuthService', []).factory('auth', ['$http', '$window', function($http, $window){
    var auth = {};

// Funzione per salvare il token in locale
auth.saveToken = function (token){
    $window.localStorage['tastysnap-token'] = token;
};

// Funzione per caricare il token salvato in locale
auth.getToken = function (){
    return $window.localStorage['tastysnap-token'];
}

// Funzione che verifica se esite un token e se è scaduto
auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
    } else {
        return false;
    }
};

// Funzione che verifica se l'utente è loggato e ritorna il suo nome
auth.currentUser = function(){
    if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.username;
    }
};


auth.register = function(user){
    return $http.post('/user/create', user).success(function(data){
        auth.saveToken(data.token);
    });
};


auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
        auth.saveToken(data.token);
    });
};


auth.logOut = function(){
    $window.localStorage.removeItem('tastysnap-token');
};

return auth;
}]);