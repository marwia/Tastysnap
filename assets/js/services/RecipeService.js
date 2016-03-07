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
         * Verifica se l'utente loggatto attualmente è l'autore della ricetta.
         */
        o.isRecipeAuthor = function (recipe) {
            if (Auth.isLoggedIn) {
                if (Auth.currentUser().id == recipe.author.id) {
                    return true;
                }
            }
            return false;
        };
        
        //funzione che restiruisce il colore bianco o nero a seonda dell'input
        o.getTextColor = function (recipe){
            //inizializzo la varibile a bianco, quindi il testo dobrebbe esseren nero.
            var c = "#000000";
            
            //recupero il colore dominante della ricetta
            c = recipe.dominantColor;
            
            //calcolo se restituire il colore bianco o nero
            c = c.substring(1);      // strip #
            var rgb = parseInt(c, 16);   // convert rrggbb to decimal
            var r = (rgb >> 16) & 0xff;  // extract red
            var g = (rgb >>  8) & 0xff;  // extract green
            var b = (rgb >>  0) & 0xff;  // extract blue
            
            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
            
            //sensibilità, valore basso poco sensibile, credo da 0 a 200
            // impostata a 150
            if(luma < 150){
                //return bianco
                return "#FFFFFF";
            }else{
                //return nero
                return "#000000";
            }
        };

        /**
         * Metodo per richiedere una lista di ricette.
         */
        o.getAll = function (skip, successCB, errorCB) {
            return $http.get(server_prefix + '/recipe',
            {
                params: {
                    'skip': skip
                }
            }).then(function (response) {
                //angular.extend(o.recipes, response.data);
                for (var i=0; i<response.data.length; i++){
                    o.recipes.push(response.data[i]);
                }
                if (successCB)
                    successCB(response);
                
            }, errorCB);
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
                .then(function(response) {
                    
                    //recipe = response.data;
                    successCallback(response);
                    
                }, function errorCallback(response) {
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
        
        /**
         * Servizio per comunicare che una ricetta è stata provata (assaggiata)
         * dall'utente loggato.
         * Disponibile solo su un dettaglio di una ricetta.
         */
        o.createTry = function (recipe) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/try', null,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .success(function (data) {
                    recipe.userTry = data;
                    recipe.trials.push(data);
                });
        };
        
        /**
         * Servizio per annullare un assaggio di una ricetta.
         * Disponibile solo su un dettaglio di una ricetta.
         */
        o.deleteTry = function (recipe) {
            return $http.delete(
                server_prefix + '/recipe/' + recipe.id + '/try',
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .success(function (data) {
                    recipe.userTry = null;
                    // elimino l'elemento corretto dall'array
                    for (var i in recipe.trials) {
                        if (recipe.trials[i].user = Auth.currentUser().id) {
                            recipe.trials.splice(i, 1);
                            break;
                        }
                    }
                });
        };

        o.checkTry = function (recipe) {
            return $http.get(server_prefix + '/recipe/' + recipe.id + '/tried',
                {
                    headers: { Authorization: 'Bearer ' + Auth.getToken() }
                }).success(function (data) {
                        recipe.userTry = data;
                });
        };
        
         /**
         * Servizio per comunicare che una ricetta è stata vista
         * dall'utente loggato.
         * Disponibile solo su un dettaglio di una ricetta.
         */
        o.createView = function (recipe) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/view', null,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .success(function (data, status) {
                    if (status == 201) {// new view
                        recipe.views.push(data);
                    }
                    recipe.userView = data;
                });
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
