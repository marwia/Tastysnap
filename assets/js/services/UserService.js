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
        var o = {
            currentUser: {},
            user: {},
            following_users: [],//quelli che si segue
            follower_users: [],//quelli che ci seguono
            users: []//lista di utenti (ricerca)
        };

        /**
         * Metodo per richiedere l'utente correntemente loggato.
         */
        o.getCurrentUser = function (successCB, errorCB) {
            return $http.get(server_prefix + '/user/' + Auth.currentUser().id).then(function (response) {
                angular.copy(response.data, o.currentUser);

                if (successCB)
                    successCB(response);
            }, errorCB);
        };

        /**
         * Metodo per aggiornare i dati dell'utente correntemente loggato.
         */
        o.update = function (user, successCB, errorCB) {
            console.info("user to update:", user);
            return $http.put(
                server_prefix + '/user/' + user.id,
                user)
                .then(function (response) {
                    // si può aggiornare soltanto l'utente loggato quindi aggiorno i dati....
                    angular.copy(response.data, o.currentUser);

                    if (successCB)
                        successCB(response);
                }, errorCB);
        };

        /**
         * Metodo per eseguire una ricerca per nome/cognome
         * di persona.
         */
        o.search = function (query, skip, reset, successCB, errorCB) {
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
            }).then(function (response) {
                if (skip) {
                    for (var i = 0; i < response.data.length; i++) {
                        o.users.push(response.data[i]);
                    }
                } else {
                    if (reset)
                        angular.copy(response.data, o.users);
                    else
                        angular.extend(o.users, response.data);
                }
                if (successCB)
                    successCB(response);
            }, errorCB);
        };

        /**
         * Metodo per richiedere la lista di utenti seguiti da un particolare
         * utente.
         */
        o.getFollowingUsers = function (userId, order_by, skip, successCB, errorCB) {
            return $http.get(server_prefix + '/user/' + userId + '/following',
                {
                    params: {
                        'skip': skip,
                        'order': order_by
                    }
                }).then(function (response) {
                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            o.following_users.push(response.data[i]);
                        }
                    } else {
                        angular.extend(o.following_users, response.data);
                    }
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

        /**
         * Metodo per richiedere la lista di utenti che seguono un particolare
         * utente.
         */
        o.getFollowerUsers = function (userId, order_by, skip, successCB, errorCB) {
            return $http.get(server_prefix + '/user/' + userId + '/follower',
                {
                    params: {
                        'skip': skip,
                        'order': order_by
                    }
                }).then(function (response) {
                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            o.follower_users.push(response.data[i]);
                        }
                    } else {
                        angular.extend(o.follower_users, response.data);
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
        o.getUserProfileImage = function (user) {
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
        o.getUserById = function (userId) {
            return $http.get(
                server_prefix + '/user/' + userId
            ).then(function (response) {
                angular.copy(response.data, o.user);
            });
        };

        /**
         * Metodo per seguire un utente.
         * Ovviamente l'operazione viene eseguita a nome dell'utente
         * correntemente loggato.
         */
        o.followUser = function (userToFollow, successCallback) {
            return $http.put(server_prefix + '/user/' + userToFollow.id + '/follow').then(function (response) {
                o.currentUser.followingCount += 1;

                /**
                 *  Se il profilo visualizzato non è quello della persona loggata
                 *  aggiorno il numero delle persone che la seguono.
                 *  Altrimenti aggiorno il numero delle persone seguite.
                 */
                if (o.user.id != o.currentUser.id)
                    o.user.followersCount += 1;//
                else
                    o.user.followingCount += 1;

                /**
                 *  Se il profilo visualizzato non è quello della persona loggata
                 *  aggiungo l'utente loggato come follower.
                 */
                if (o.user.id != o.currentUser.id)
                    o.follower_users.push(o.currentUser);
                else 
                    // aggiungo l'utente
                    o.following_users.push(userToFollow);

                userToFollow.isFollowed = true;
                successCallback();
            });
        };

        /**
         * Metodo per smettere di seguire un utente.
         * Ovviamente l'operazione viene eseguita a nome dell'utente
         * correntemente loggato.
         */
        o.unfollowUser = function (userToUnfollow, successCallback) {
            return $http.delete(server_prefix + '/user/' + userToUnfollow.id + '/follow')
                .then(function (response) {
                    o.currentUser.followingCount -= 1;

                    /**
                     *  Se il profilo visualizzato non è quello della persona loggata
                     *  aggiorno il numero delle persone che la seguono.
                     *  Altrimenti aggiorno il numero delle persone seguite.
                     */
                    if (o.user.id != o.currentUser.id)
                        o.user.followersCount -= 1;
                    else
                        o.user.followingCount -= 1;
                    
                    /**
                     *  Se il profilo visualizzato non è quello della persona loggata
                     *  tolgo l'utente loggato come follower.
                     */
                    if (o.user.id != o.currentUser.id)
                        for (var i in o.follower_users) {
                            if (o.follower_users[i].id == o.currentUser.id) {
                                o.follower_users.splice(i, 1);
                                break;
                            }
                        }
                    else
                        // rimuovo l'utente
                        for (var i in o.following_users) {
                            if (o.following_users[i].id == userToUnfollow.id) {
                                o.following_users.splice(i, 1);
                                break;
                            }
                        }

                    userToUnfollow.isFollowed = false;
                    if (successCallback)
                        successCallback(response);
                });
        };

        /**
         * Metodo per verificare se l'utente loggato 
         * sta seguendo un'altro utente.
         */
        o.areYouFollowing = function (userToCheck, successCallback) {
            return $http.get(server_prefix + '/user/following/' + userToCheck.id)
                .then(function (response) {

                    userToCheck.isFollowed = true;
                    if (successCallback)
                        successCallback(response);

                }, function (response) {
                    userToCheck.isFollowed = false;
                });
        };

        o.toggleFollow = function (user) {
            if (user.isFollowed == true) {
                o.unfollowUser(user, function () {
                    //fatto
                })
            } else {
                o.followUser(user, function () {
                    //fatto
                })
            }
        };


        return o;
    }]);