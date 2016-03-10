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
                .then(function (response) {
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
                , function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
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