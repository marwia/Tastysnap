/**
 * assets/admin_assets/js/services/UserService.js
 *
 * Mariusz Wiazowski
 *
 * Service per gestire le operazioni sugli utenti.
 */
angular.module('UserService', [])
    .factory('User', ['$http', 'Auth', function($http, Auth) {

        var server_prefix = '/api/v1';

        var o = {
            users: []
        }

        /**
         * Metodo per richiedere la lista di utenti che seguono un particolare
         * utente.
         */
        o.getUsers = function(order_by, skip, successCB, errorCB) {
            var params = {};
            if (order_by)
                params['order'] = order_by;
            if (skip)
                params['skip'] = skip;
            return $http.get(server_prefix + '/user',
                {
                    params: params
                }).then(function(response) {
                    console.info("resp", response.data);
                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            o.users.push(response.data[i]);
                        }
                    } else {
                        angular.extend(o.users, response.data);
                    }
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

        o.search = function(query, skip, reset, successCB, errorCB) {
            return $http.get(server_prefix + '/user').then(function(response) {
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

        o.delete = function(user,successCB, errorCB) {
            return $http.delete(server_prefix + '/user/' + user.id)
                .then(function(response) {
                    // remove the deleted collection
                    for (var i in o.users) {
                        if (o.users[i].id == user.id) {
                            o.users.splice(i, 1);
                            break;
                        }
                    }
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

        /**
         * Conta il numero totale degli utenti.
         */
        o.getUsersCount = function(successCB, errorCB) {
            return $http.get(server_prefix + '/user',
                {
                    params: {
                        'count': true
                    }
                })
                .then(function(response) {
                    angular.copy(o.users_count, response.data);
                    if (successCB)
                        successCB(response);
                }, errorCB);
        };

        return o;

        

    }]);