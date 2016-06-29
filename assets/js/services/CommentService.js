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
                null)
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdComment = response.data;
                    createdComment.user = User.currentUser;
                    createdComment.upvotesCount = 0;
                    createdComment.downvotesCount = 0;

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
                null)
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdUpvote = response.data;
                    createdUpvote.user = User.currentUser;

                    // push on top
                    comment.upvotesCount++;
                    comment.userUpvote = createdUpvote;

                    // se esiste il downvote dello stesso utente allora 
                    // devo cancellarlo
                    if (comment.userDownvote) {
                        comment.downvotesCount--;
                        comment.userDownvote = null;
                    }

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
                null)
                .then(function(response) {
                    // populo il campo user manualmente (il server non lo fa e non deve)
                    var createdDownvote = response.data;
                    createdDownvote.user = User.currentUser;

                    // push on top
                    comment.downvotesCount++;
                    comment.userDownvote = createdDownvote;

                    // se esiste il upvote dello stesso utente allora 
                    // devo cancellarlo
                    if (comment.userUpvote) {
                        comment.upvotesCount--;
                        comment.userUpvote = null;
                    }

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
                null)
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
                , function(response) {
                    console.log(response);
                });
        };

        o.checkVote = function(comment) {
            return $http.get(
                server_prefix + '/comment/' + comment.id + '/voted',
                null)
                .then(function(response) {
                    if (response.data.value > 0) {
                        comment.userUpvote = response.data;
                    }
                    else {
                        comment.userDownvote = response.data;
                    }
                }
                , function(response) {
                    console.log(response);
                });
        };

        /**
        * Metodo per richiedere la lista di ricette di 
        * una data collection
        */
        o.getRecipeComments = function(recipe, limit, skip, successCB, errorCB) {
            return $http.get(
                server_prefix + '/recipe/' + recipe.id + '/comment',
                {
                    params: {
                        'sort': 'createdAt DESC',
                        'skip': skip,
                        'limit': limit
                    }
                })
                .then(function(response) {
                    
                    //inizializzo l'array dei commenti
                    if (!recipe.comments)
                        recipe.comments = [];
                       
                    //se è presente qualche valore sullo skip 
                    //allora devo aggiungere i commenti 
                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            recipe.comments.push(response.data[i]);
                        }
                    } else {
                        angular.extend(recipe.comments, response.data);
                    }

                    if (successCB)
                        successCB(response);

                }, function errorCallback(response) {
                    
                    if (!skip) {
                        // no comment found for this recipe
                        recipe.comments = [];
                    }
                    if (errorCB)
                        errorCB(response);
                });
        };

        /**
         * Funzione per eliminare un commento riguardante una ricetta.
         */
        o.delete = function(recipe, commentToDelete) {
            return $http.delete(
                server_prefix + '/comment/' + commentToDelete.id,
                null)
                .then(function(response) {

                    recipe.commentsCount--;
                    for (var i in recipe.comments) {
                        if (recipe.comments[i].id == commentToDelete.id) {
                            recipe.comments.splice(i, 1);
                            break;
                        }
                    }
                }
                , function(response) {
                    console.log(response);
                });
        };

        return o;
    }]);