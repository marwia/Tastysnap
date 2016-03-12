/**
 * assets/js/services/CommentService.js
 *
 * Mariusz Wiazowski
 *
 * Service usato per gestire i commenti a ricette.
 */

angular.module('CommentService', [])
    .factory('Comment', ['$http', 'Auth', 'User', function($http, Auth, User) {

        var server_prefix = '/api/v1';

        // service body    
        var o = {};

        /**
         * Servizio per creare un commento ad una ricetta.
         */
        o.create = function(recipe, comment, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/comment',
                comment,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdComment = response.data;
                    createdComment.user = User.currentUser;
                    
                    // push on top
                    recipe.commentsCount++;
                    recipe.comments.unshift(createdComment);
                    
                    if (successCallback) {
                        successCallback(response);
                    }
                }
                , function(response) {
                    if (errorCallback) {
                        errorCallback(response);
                    }
                    console.log(response);
                });
        };
        
        /**
         * Servizio per creare un voto positivo ad un commento.
         */
        o.upvote = function(comment, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/comment/' + comment.id + '/upvote',
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdUpvote = response.data;
                    createdUpvote.user = User.currentUser;
                    
                    // push on top
                    comment.upvotesCount++;
                    comment.userUpvote = createdUpvote;
                    
                    if (successCallback) {
                        successCallback(response);
                    }
                }
                , function(response) {
                    if (errorCallback) {
                        errorCallback(response);
                    }
                    console.log(response);
                });
        };
        
        /**
         * Servizio per creare un commento ad una ricetta.
         */
        o.downvote = function(comment, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/comment/' + comment.id + '/downvote',
                null,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdDownvote = response.data;
                    createdDownvote.user = User.currentUser;
                    
                    // push on top
                    comment.downvotesCount++;
                    comment.userDownvote = createdDownvote;
                    
                    if (successCallback) {
                        successCallback(response);
                    }
                }
                , function(response) {
                    if (errorCallback) {
                        errorCallback(response);
                    }
                    console.log(response);
                });
        };
        
        o.deleteVote = function(comment, vote) {
            return $http.delete(
                server_prefix + '/comment/' + comment.id + '/vote', 
                {
                    headers: { 
                        Authorization: 'Bearer ' + Auth.getToken() 
                    }
                })
                .then(function(response) {
                    if (vote.value > 0) {
                        comment.userUpvote = null;
                        comment.upvotesCount -= 1;
                    }
                    else {
                        comment.userDownvote = null;
                        comment.downvotesCount -= 1;
                    }
                }
                , function (response) {
                    console.log(response);
                });
        };
        
        o.checkVote = function(comment) {
            return $http.get(
                server_prefix + '/comment/' + comment.id + '/voted',
                {
                    headers: { 
                        Authorization: 'Bearer ' + Auth.getToken() 
                    }
                })
                .then(function(response) {
                    if (response.data.value > 0) {
                        comment.userUpvote = response.data;
                    }
                    else {
                        comment.userDownvote = response.data;
                    }
                }
                , function (response) {
                    console.log(response);
                });
        };
        
         /**
         * Metodo per richiedere la lista di ricette di 
         * una data collection
         */
        o.getRecipeComments = function (recipe) {
            return $http.get(
                server_prefix + '/recipe/' + recipe.id + '/comment',
                {
                    params: {
                        'sort': 'createdAt DESC'
                    }
                })
            .then(function (response) {
                recipe.comments = [];
                angular.copy(response.data, recipe.comments);
                
            }, function errorCallback(response) {
     
                    console.log(response);
                });
        };

        return o;
    }]);