/**
 * assets/js/services/UserService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano gli utenti.
 * 
 * Copyright 2016 Mariusz Wiazowski
 */

angular.module('UserService', [])
    .factory('User', ['$http', 'Auth', function ($http, Auth) {

        var server_prefix = '/api/v1';
        
        // service body
        var service = {
            currentUser : {},
            user : {}
        };
        
        /**
         * Metodo per richiedere l'utente correntemente loggato.
         */
        service.getCurrentUser = function () {
            return $http.get(server_prefix + '/user/' + Auth.currentUser().id).success(function (data) {
                angular.copy(data, service.currentUser);
            });
        };
        
        /**
         * Metodo per richiedere l'utente tramite id.
         */
        service.getUserById = function (id) {
            return $http.get(server_prefix + '/user/' + id).success(function (data) {
                angular.copy(data, service.user);
            });
        };


        return service;
    }]);