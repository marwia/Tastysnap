/**
 * assets/js/services/UserService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano gli utenti.
 * 
 * Copyright 2016 Mariusz Wiazowski
 */

angular.module('UserService', [])
    .factory('User', ['$http', 'Auth', function($http, Auth) {

        var server_prefix = '/api/v1';

        // service body
        var service = {
            currentUser: {},
            user: {},
            following_users: [],//quelli che si segue
            follower_users: [],//quelli che ci seguono
            users: []//lista di utenti (ricerca)
        };

        /**
         * Metodo per richiedere l'utente correntemente loggato.
         */
        service.getCurrentUser = function(successCB, errorCB) {
            return $http.get(server_prefix + '/user/' + Auth.currentUser().id).then(function(response) {
                angular.copy(response.data, service.currentUser);

                if (successCB)
                    successCB(response);
            }, errorCB);
        };

        /**
         * Metodo per aggiornare i dati dell'utente correntemente loggato.
         */
        service.update = function(user, successCB, errorCB) {
            console.info("user to update:", user);
            return $http.put(
                server_prefix + '/user/' + user.id,
                user)
                .then(function(response) {
                    // si può aggiornare soltanto l'utente loggato quindi aggiorno i dati....
                    angular.copy(response.data, service.currentUser);

                    if (successCB)
                        successCB(response);
            }, errorCB);
        };

        /**
         * Metodo per eseguire una ricerca per nome/cognome
         * di persona.
         */
        service.search = function(query, skip, reset, successCB, errorCB) {
            return $http.get(server_prefix + '/user', {
                params: {
                    where: {
                        "or": [
                            { 
                                "name": { "contains": query } 
                            },
                            {
                                "surname": { "contains": query } 
                            }
                        ]
                    }
                }
            }).then(function(response) {
                if (skip) {
                    for (var i = 0; i < response.data.length; i++) {
                        service.users.push(response.data[i]);
                    }
                } else {
                    if (reset)
                        angular.copy(response.data, service.users);
                    else
                        angular.extend(service.users, response.data);
                }
                if (successCB)
                    successCB(response);
            }, errorCB);
        };

        /**
         * Metodo per richiedere la lista di utenti seguiti da un particolare
         * utente.
         */
        service.getFollowingUsers = function(userId, order_by, skip, successCB, errorCB) {
            return $http.get(server_prefix + '/user/' + userId + '/following',
                {
                    params: {
                        'skip': skip,
                        'order': order_by
                    }
                }).then(function(response) {
                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            service.following_users.push(response.data[i]);
                        }
                    } else {
                        angular.extend(service.following_users, response.data);
                    }
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

        /**
         * Metodo per richiedere la lista di utenti che seguono un particolare
         * utente.
         */
        service.getFollowerUsers = function(userId, order_by, skip, successCB, errorCB) {
            return $http.get(server_prefix + '/user/' + userId + '/follower',
                {
                    params: {
                        'skip': skip,
                        'order': order_by
                    }
                }).then(function(response) {
                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            service.follower_users.push(response.data[i]);
                        }
                    } else {
                        angular.extend(service.follower_users, response.data);
                    }
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

        /**
         * Metodo per richiedere l'immagine di profile dell'utente
         * loggato. E' necessaria in quanto l'utente può avere una o più
         * immagini a secondo del metodo di iscrizione usato.
         */
        service.getUserProfileImage = function(user) {
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
        service.getUserById = function(userId) {
            return $http.get(
                server_prefix + '/user/' + userId
            ).then(function(response) {
                angular.copy(response.data, service.user);
            });
        };

        /**
         * Metodo per seguire un utente.
         * Ovviamente l'operazione viene eseguita a nome dell'utente
         * correntemente loggato.
         */
        service.followUser = function(userToFollow, successCallback) {
            return $http.put(server_prefix + '/user/' + userToFollow.id + '/follow').then(function(response) {
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
        service.unfollowUser = function(userToUnfollow, successCallback) {
            return $http.delete(server_prefix + '/user/' + userToUnfollow.id + '/follow')
                .then(function(response) {
                    service.currentUser.following -= 1;
                    userToUnfollow.followers -= 1;

                    userToUnfollow.isFollowed = false;
                    if (successCallback)
                        successCallback(response);
                });
        };

        /**
         * Metodo per verificare se l'utente loggato 
         * sta seguendo un'altro utente.
         */
        service.areYouFollowing = function(userToCheck, successCallback) {
            return $http.get(server_prefix + '/user/following/' + userToCheck.id)
                .then(function(response) {

                    userToCheck.isFollowed = true;
                    if (successCallback)
                        successCallback(response);

                }, function(response) {
                    userToCheck.isFollowed = false;
                });
        };


        return service;
    }]);