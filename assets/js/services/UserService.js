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
            currentUser: {},
            user: {}
        };
        
        /**
         * Metodo per richiedere l'utente correntemente loggato.
         */
        service.getCurrentUser = function () {
            return $http.get(server_prefix + '/user/' + Auth.currentUser().id).then(function (response) {
                angular.copy(response.data, service.currentUser);
            });
        };
        
        /**
         * Metodo per richiedere l'immagine di profile dell'utente
         * loggato. E' necessaria in quanto l'utente può avere una o più
         * immagini a secondo del metodo di iscrizione usato.
         */
        service.getUserProfileImage = function (user) {
            if (user != null) {
                if (user.facebookImageUrl != null)
                    return user.facebookImageUrl;
                if (user.googleImageUrl != null)
                    return user.googleImageUrl;
                if (user.twitterImageUrl != null)
                    return user.twitterImageUrl;
            }
            return null;
        };
        
        /**
         * Metodo per richiedere l'utente tramite id.
         */
        service.getUserById = function (userId) {
            return $http.put(server_prefix + '/user/' + userId).then(function (response) {
                angular.copy(response.data, service.user);
            });
        };
        
        /**
         * Metodo per seguire un utente.
         * Ovviamente l'operazione viene eseguita a nome dell'utente
         * correntemente loggato.
         */
        service.followUser = function (userToFollow, successCallback) {
            return $http.put(server_prefix + '/user/' + userToFollow.id + '/follow',
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }).then(function (response) {
                    service.currentUser.following += 1;
                    userToFollow.followers += 1;

                    userToFollow.isFollowed = true;
                    successCallback();
                });
        };
        
        /**
         * Metodo per smettere di seguire un utente.
         * Ovviamente l'operazione viene eseguita a nome dell'utente
         * correntemente loggato.
         */
        service.unfollowUser = function (userToUnfollow, successCallback) {
            return $http.delete(server_prefix + '/user/' + userToUnfollow.id + '/follow',
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }).then(function (response) {
                    service.currentUser.following -= 1;
                    userToUnfollow.followers -= 1;

                    userToUnfollow.isFollowed = false;
                    successCallback();
                });
        };
        
        /**
         * Metodo per smettere di seguire un utente.
         * Ovviamente l'operazione viene eseguita a nome dell'utente
         * correntemente loggato.
         */
        service.areYouFollowing = function (userToCheck) {
            return $http.get(server_prefix + '/user/following/' + userToCheck.id,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }).then(function (response) {

                    userToCheck.isFollowed = true;
                });
        };


        return service;
    }]);