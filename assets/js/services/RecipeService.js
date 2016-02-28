/**
 * assets/js/services/RecipeService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano le ricette.
 */
angular.module('RecipeService', [])
    .factory('Recipe', ['$http', 'Auth', function ($http, Auth) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
            recipes: [],
            detailedRecipe: {}, // one recipe 
            recipeCategories: [],
            dosagesTypes: []
        };

        /**
         * Metodo per richiedere una lista di ricette.
         */
        o.getAll = function () {
            return $http.get(server_prefix + '/recipe').success(function (data) {
                angular.copy(data, o.recipes);
            });
        };
    
        /**
         * Metodo per richiedere una lista di ricette di un dato utente.
         */
        o.getUserRecipes = function (userId) {
            return $http.get(server_prefix + '/recipe', {
                params: {
                    where: {
                        "author": userId
                    }
                }
            }).success(function (data) {
                angular.copy(data, o.recipes);
            });
        };
        
        /**
         * Metodo per richiedere una lista di ricette preferite 
         * (con upvote dato dall'utente) di un dato utente.
         */
        o.getUserUpvotedRecipes = function (userId) {
            return $http.get(server_prefix + '/user/' + userId + '/upvoted_recipe').success(function (data) {
                angular.copy(data, o.recipes);
            });
        };
        
        /**
         * Metodo per richiedere una lista di ricette viste 
         * da un dato utente.
         */
        o.getUserViewedRecipes = function (userId) {
            return $http.get(server_prefix + '/user/' + userId + '/viewed_recipe').success(function (data) {
                angular.copy(data, o.recipes);
            });
        };
        
        /**
         * Metodo per richiedere una lista di ricette provate 
         * da un dato utente.
         */
        o.getUserTriedRecipes = function (userId) {
            return $http.get(server_prefix + '/user/' + userId + '/tried_recipe').success(function (data) {
                angular.copy(data, o.recipes);
            });
        };

        o.delete = function (recipeId, successCallback, errorCallback) {
            return $http.delete(
                server_prefix + '/recipe/' + recipeId,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(successCallback, errorCallback);
        };
    
        /**
         * Metodo per richiedere una una ricetta tramite il suo id.
         */
        o.getRecipe = function (recipeId) {
            return $http.get(server_prefix + '/recipe/' + recipeId).success(function (data) {
                angular.copy(data, o.detailedRecipe);
            });
        };

        /**
         * Metodo per richiedere una lista di categorie di ricette.
         */
        o.getAllRecipeCategories = function () {
            return $http.get(server_prefix + '/recipe/categories').success(function (data) {
                angular.copy(data.enum, o.recipeCategories);
            });
        };

        /**
         * Metodo per richiedere una lista di categorie di ricette.
         */
        o.getAllDosageTypes = function () {
            return $http.get(server_prefix + '/recipe/dosage_types').success(function (data) {
                angular.copy(data.enum, o.dosagesTypes);
            });
        };

        /**
         * Servizio per creare una ricetta.
         */
        o.create = function (recipe, successCallback) {
            return $http.post(
                server_prefix + '/recipe',
                recipe,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(successCallback, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };
    
        /**
         * Servizio per caricare l'immagine sfocata della ricetta.
         * Attenzione non funziona con IE <= 9
         */
        o.uploadBlurImage = function (file, recipe, successCallback, errorCallback) {

            var fd = new FormData();
            fd.append('image', file);

            var url = server_prefix + "/recipe/" + recipe.id + "/upload_blurred_cover_image";

            $http.put(url, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            })
                .success(function (data) {
                    successCallback(data);
                })
                .error(function (err) {
                    errorCallback(err);
                    console.log(err);
                });
        };


        o.upvote = function (recipe) {
            return $http.post(server_prefix + '/recipe/' + recipe.id + '/upvote', null, {
                headers: { Authorization: 'Bearer ' + Auth.getToken() }
            })
                .success(function (data) {
                    recipe.votes.push(data);// opzionale...
                    recipe.userVote = data.value;
                    recipe.votesCount += 1;
                })
                .error(function (err) {
                    console.log(err);
                });
        };
        
        o.deleteVote = function (recipe) {
            return $http.delete(server_prefix + '/recipe/' + recipe.id + '/vote', {
                headers: { Authorization: 'Bearer ' + Auth.getToken() }
            })
                .success(function (data) {
                    recipe.userVote = 0;
                    recipe.votesCount -= 1;
                })
                .error(function (err) {
                    console.log(err);
                });
        };

        o.checkVote = function (recipe) {
            return $http.get(server_prefix + '/recipe/' + recipe.id + '/voted',
                {
                    headers: { Authorization: 'Bearer ' + Auth.getToken() }
                }).success(
                    function (data) {
                        recipe.userVote = data.value;
                    }
                    );
        };
        

        /*
        o.get = function (id) {
            return $http.get(server_prefix + '/post/' + id).then(function (res) {
                return res.data;
            });
        };

        o.addComment = function (id, comment) {
            return $http.post(server_prefix + '/post/' + id + '/comment', comment, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            });
        };

        o.upvoteComment = function (post, comment) {
            return $http.put(server_prefix + '/post/' + post.id + '/comment/' + comment.id + '/upvote', null, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function (data) {
                comment.upvotes += 1;
            });
        };
        */

        return o;
    }]);
