/**
 * assets/js/services/RecipeService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano le ricette.
 */
angular.module('RecipeService', [])
    .factory('Recipe', ['$http', 'Auth', 'User', '$stateParams', '$location', function($http, Auth, User, $stateParams, $location) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
            recipes: [],
            detailedRecipe: {}, // one recipe 
            recipeCategories: [],
            dosagesTypes: [],
            sortOptions: ["undefined","commentsCount", "trialsCount", "votesCount", "viewsCount",
                "difficulty", "cost", "calories", "preparationTime", "title"]
        };

        /**
         * Verifica se l'utente loggatto attualmente è l'autore della ricetta.
         */
        o.isRecipeAuthor = function(recipe) {
            if (Auth.isLoggedIn) {
                if (Auth.currentUser().id == recipe.author.id) {
                    return true;
                }
            }
            return false;
        };

        //funzione che restiruisce il colore bianco o nero a seonda dell'input
        o.getTextColor = function(recipe) {
            //inizializzo la varibile a bianco, quindi il testo dobrebbe essere nero.
            var c = "#000000";

            //recupero il colore dominante della ricetta
            c = recipe.dominantColor;

            //calcolo se restituire il colore bianco o nero
            c = c.substring(1);      // strip #
            var rgb = parseInt(c, 16);   // convert rrggbb to decimal
            var r = (rgb >> 16) & 0xff;  // extract red
            var g = (rgb >> 8) & 0xff;  // extract green
            var b = (rgb >> 0) & 0xff;  // extract blue

            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

            //sensibilità, valore basso poco sensibile, credo da 0 a 200
            // impostata a 150
            if (luma < 150) {
                //return bianco
                return "#FFFFFF";
            } else {
                //return nero
                return "#000000";
            }
        };

        /**
         * Metodo per richiedere una lista di ricette.
         */
        o.getAll = function(order_by, skip, successCB, errorCB) {
            return $http.get(server_prefix + '/recipe',
                {
                    params: {
                        'skip': skip,
                        'sort': order_by
                    }
                }).then(function(response) {
                    if (skip) {
                        for (var i = 0; i < response.data.length; i++) {
                            o.recipes.push(response.data[i]);
                        }
                    } else {
                        angular.extend(o.recipes, response.data);
                    }
                    if (successCB)
                        successCB(response);

                }, errorCB);
        };

        /**
         * Metodo per eseguire una ricerca per titolo di ricetta.
         */
        o.search = function(query, skip, successCB, errorCB) {
            return $http.get(server_prefix + '/recipe', {
                params: {
                    where: {
                        "title": { "contains": query },
                        'skip': skip
                    }
                }
            }).then(function(response) {
                if (skip) {
                    for (var i = 0; i < response.data.length; i++) {
                        o.recipes.push(response.data[i]);
                    }
                } else {
                    angular.extend(o.recipes, response.data);
                }
                if (successCB)
                    successCB(response);
            }, errorCB);
        };
        
        /**
         * Metodo per eseguire una ricerca per titolo di ricetta.
         */
        o.searchByCoordinates = function(latitude, longitude, maxDistance, successCB, errorCB) {
            return $http.get(server_prefix + '/recipe/search/coordinates', {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    maxDistance: maxDistance
                }
            }).then(function(response) {
                // always reset
                angular.copy(response.data, o.recipes);
                
                if (successCB)
                    successCB(response);
            }, errorCB);
        };
        
        /**
         * Metodo per eseguire una ricerca AVANZATA per titolo di ricetta.
         * @param {String} recipeTitle - parte del titolo della ricetta
         * @param {String Array} categoryArray - array con le categorie in OR
         * @param {String Array} productsIdsArray - array con gli prodotti in AND
         * @param {String} difficulty - diffcoltà media richiesta dalla ricetta
         * @param {String} cost - costo medio della ricetta
         * @param {String} calories - calorie medie richieste dalla ricetta
         * @param {Number} sort_by - numero che indica per cosa ordinare i risultati (in base all'array 'sortOptions')
         * @param {String} sort_mode - stringa che indica la modalità di ordinazione ASC o DESC
         * @param {Number} skip - numero di risultati da saltare, utile per la paginazione
         * @param {Boolean} reset - se true indica che i risultati devono sovrascrivere quelli
         * attuali, di default è false
         */
        o.advancedSearch = function(
            recipeTitle, 
            categoryArray, 
            productsIdsArray, 
            difficulty, cost, calories,
            maxTime,
            sort_by, sort_mode,
            skip, 
            reset, successCB, errorCB) {
                
                // parametri base
            var params = {
                where: {
                        "title": { "contains": recipeTitle }
                    }
            };
            
            // parametri aggiuntivi
            if (categoryArray != null && categoryArray.length > 0)
                params.where["category"] = categoryArray;// categories in OR
                
            if (productsIdsArray != null && productsIdsArray.length > 0)
                params.where["products"] = productsIdsArray;// products in AND
                
            if (difficulty != null)
                params.where["difficulty"] = { '>': difficulty - 1, '<=': difficulty };
            if (cost != null)
                params.where["cost"] = { '>': cost - 1, '<=': cost };
            if (calories != null)
                params.where["calories"] = { '>': calories - 1, '<=': calories };
                
            if (maxTime)
                params.where["preparationTime"] = { '<=': maxTime};
                
            if (sort_by != null && sort_by > 0)
                params["sort"] = o.sortOptions[sort_by] + " " + sort_mode;
                
            if (skip != null)
                params["skip"] = skip;
                 
            // esecuzione della richiesta
            return $http.get(server_prefix + '/recipe/search', params)
                .then(function(response) {
                if (skip) {
                    for (var i = 0; i < response.data.length; i++) {
                        o.recipes.push(response.data[i]);
                    }
                } else {
                    if (reset)
                        angular.copy(response.data, o.recipes);
                    else
                        angular.extend(o.recipes, response.data);
                }
                if (successCB)
                    successCB(response);
            }, function (response) {
                // nessuna ricetta trovata? Pulisco tutto...
                angular.copy([], o.recipes);
                if (errorCB)
                    errorCB(response);
            });
        };
        
        o.writeSearchFilters = function (filters) {
            // scrivo i filtri di ricerca nel url
            var encodedString = btoa(JSON.stringify(filters));
            $location.search("f", encodedString);
        };
        
        o.readSearchFilters = function () {
            // leggo i filtri dall'url
            var encodedFilters = $location.search()["f"];
            if (encodedFilters) {
                var decodedFiltersString = atob(encodedFilters);
                var decodedFilters = JSON.parse(decodedFiltersString);
                return decodedFilters;
            }
            return null;
        };
        
        o.toIdArray = function (objArray) {
            var temp = [];
            objArray.forEach(function (element) {
                temp.push(element.id);
            }, this);
            return temp;
        }

        /**
         * Metodo per richiedere una lista di ricette di un dato utente.
         */
        o.getUserRecipes = function(userId, successCB, errorCB) {
            return $http.get(server_prefix + '/recipe', {
                params: {
                    where: {
                        "author": userId
                    }
                }
            }).then(function(response) {
                angular.copy(response.data, o.recipes);
                if (successCB)
                    successCB(response);
            }, errorCB);
        };

        /**
         * Metodo per richiedere una lista di ricette preferite 
         * (con upvote dato dall'utente) di un dato utente.
         */
        o.getUserUpvotedRecipes = function(userId) {
            return $http.get(server_prefix + '/user/' + userId + '/upvoted_recipe')
                .then(function(response) {
                    angular.copy(response.data, o.recipes);
            });
        };

        /**
         * Metodo per richiedere una lista di ricette viste 
         * da un dato utente.
         */
        o.getUserViewedRecipes = function(userId) {
            return $http.get(server_prefix + '/user/' + userId + '/viewed_recipe')
                .then(function(response) {
                    angular.copy(response.data, o.recipes);
            });
        };

        /**
         * Metodo per richiedere una lista di ricette provate 
         * da un dato utente.
         */
        o.getUserTriedRecipes = function(userId) {
            return $http.get(server_prefix + '/user/' + userId + '/tried_recipe')
                .then(function(response) {
                angular.copy(response.data, o.recipes);
            });
        };

        o.delete = function(recipeId, successCallback, errorCallback) {
            return $http.delete(
                server_prefix + '/recipe/' + recipeId)
                .then(function(response) {
                    // remove the deleted recipe
                    for (var i in o.recipes) {
                        if (o.recipes[i].id == recipeId) {
                            o.recipes.splice(i, 1);
                            break;
                        }
                    }
                    User.currentUser.recipesCount--;
                    // call the cb
                    if (successCallback)
                        successCallback(response);
                }, errorCallback);
        };

        /**
         * Metodo per richiedere una una ricetta tramite il suo id.
         */
        o.getRecipe = function(recipeId) {
            return $http.get(server_prefix + '/recipe/' + recipeId)
                .then(function(response) {
                    angular.copy(response.data, o.detailedRecipe);
            });
        };

        /**
         * Metodo per richiedere una lista di categorie di ricette.
         */
        o.getAllRecipeCategories = function() {
            return $http.get(server_prefix + '/recipe/categories')
                .then(function(response) {
                    angular.copy(response.data.enum, o.recipeCategories);
            });
        };

        /**
         * Metodo per richiedere una lista di categorie di ricette.
         */
        o.getAllDosageTypes = function() {
            return $http.get(server_prefix + '/recipe/dosage_types')
                .then(function(response) {
                    angular.copy(response.data.enum, o.dosagesTypes);
            });
        };

        /**
         * Servizio per creare una ricetta.
         */
        o.create = function(recipe, successCallback) {
            return $http.post(
                server_prefix + '/recipe',
                recipe)
                .then(function(response) {

                    User.currentUser.recipesCount++;
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
        o.uploadBlurImage = function(file, recipe, successCallback, errorCallback) {

            var fd = new FormData();
            fd.append('image', file);

            var url = server_prefix + "/recipe/" + recipe.id + "/upload_blurred_cover_image";

            $http.put(url, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                .then(function(response) {
                    successCallback(response.data);

                }, function(err) {
                    errorCallback(err);
                    console.log(err);
                });
        };


        o.upvote = function(recipe) {
            return $http.post(server_prefix + '/recipe/' + recipe.id + '/upvote')
                .then(function(response) {
                    recipe.userVote = response.data.value;
                    recipe.votesCount += 1;

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        o.deleteVote = function(recipe) {
            return $http.delete(server_prefix + '/recipe/' + recipe.id + '/vote')
                .then(function(response) {
                    recipe.userVote = 0;
                    recipe.votesCount -= 1;

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        o.checkVote = function(recipe) {
            return $http.get(server_prefix + '/recipe/' + recipe.id + '/voted')
                .then(function(response) {
                    recipe.userVote = response.data.value;
                });
        };

        /**
         * Servizio per comunicare che una ricetta è stata provata (assaggiata)
         * dall'utente loggato.
         * Disponibile solo su un dettaglio di una ricetta.
         */
        o.createTry = function(recipe) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/try')
                .then(function(response) {
                    recipe.userTry = response.data;
                    // per ora non serve
                    //recipe.trials.push(data);
                    recipe.trialsCount++;

                }, function(response) {
                    console.log(response);
                });
        };

        /**
         * Servizio per annullare un assaggio di una ricetta.
         * Disponibile solo su un dettaglio di una ricetta.
         */
        o.deleteTry = function(recipe) {
            return $http.delete(
                server_prefix + '/recipe/' + recipe.id + '/try')
                .then(function(response) {
                    recipe.userTry = null;
                    recipe.trialsCount--;
                    // elimino l'elemento corretto dall'array
                    /* per ora non serve
                    for (var i in recipe.trials) {
                        if (recipe.trials[i].user = Auth.currentUser().id) {
                            recipe.trials.splice(i, 1);
                            break;
                        }
                    }*/

                }, function(response) {
                    console.log(response);
                });
        };

        o.checkTry = function(recipe) {
            return $http.get(server_prefix + '/recipe/' + recipe.id + '/tried')
                .then(function(response) {
                    recipe.userTry = response.data;
                });
        };

        /**
        * Servizio per comunicare che una ricetta è stata vista
        * dall'utente loggato.
        * Disponibile solo su un dettaglio di una ricetta.
        */
        o.createView = function(recipe) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/view')
                .then(function(response) {
                    if (response.status == 201) {// new view
                        recipe.views.push(response.data);
                    }
                    recipe.userView = response.data;
                });
        };
        
        /**
         * Servizio per comunicare che una ricetta è stata segnalata
         * dall'utente loggato.
         * Disponibile solo su un dettaglio di una ricetta.
         */
        o.createReport = function(recipeId, reportToCreate, successCallback, errorCallback) {
            return $http.post(
                server_prefix + '/recipe/' + recipeId + '/report',
                reportToCreate)
                .then(function(response) {
                    //nothing
                    if (successCallback) 
                        successCallback(response);
                        
                }, function(response) {
                    console.log(response);
                    
                    if (errorCallback)
                        errorCallback(response);
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
