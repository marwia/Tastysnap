/**
 * assets/js/appRoutes.js
 *
 * Mariusz Wiazowski
 *
 * Router per l'applicazione Angular, quindi una sorta di router client-side.
 * E' una parte fondamentale di una applicazione single-page, indica tutti gli stati 
 * possibili dell'applicazione e le rispettive view (template o partials) da 
 * mostrare all'utente.
 * E' stato utilizzato un modulo chiamata "ui-router" perchè è più potente di quello
 * nativo, infatti è possibile creare view annidate e addirittura multiple e
 * distinguerle con dei nomi.
 * 
 */
angular.module('appRoutes', []).config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        // Dichiaro i vari stati dell'app
        $stateProvider
        
            .state('main', {
                url: '/',
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    } else {
                        $state.go('app.home.most_recent');
                    }
                }]
            })

            /**
             * Stato genitore organizzato in 3 view.
             */
            .state('app', {
                url: '/app',
                views: {
                    '': {
                        templateUrl: 'templates/app.html',
                        controller: 'MasterCtrl'
                    },
                    'navbar@app': {
                        templateUrl: 'partials/navbar.html',
                        resolve: {
                            userPromise: ['User', function(user) {
                                return user.getCurrentUser();
                            }]
                        }
                    },
                    'sidebar@app': { templateUrl: 'partials/sidebar.html' }
                },
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })

            .state('app.recipe_create', {
                url: '/recipe_create',
                views: {
                    'content@app': {
                        templateUrl: 'templates/recipe_create.html',
                        controller: 'RecipeCreateCtrl',
                        // ogni volta che parte da questo stato farà questa funzione
                        resolve: {
                            postPromise: ['Recipe', function(recipes) {
                                return recipes.getAllRecipeCategories();
                            }],
                            dosageType: ['Recipe', function(recipes) {
                                return recipes.getAllDosageTypes();
                            }]
                        }
                    }
                }
            })

            // SEARCH
            .state('app.search', {
                url: '/search?q',
                views: {
                    'content@app': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl',
                        onEnter: ['$state', '$stateParams', function($state, $stateParams) {
                            console.log("resolve home");
                            console.log($stateParams.q);
                        }]
                    }
                }
            })

            // HOME
            .state('app.home', {
                url: '/home',
                views: {
                    'content@app': {
                        templateUrl: 'templates/home.html',
                        controller: 'UserHomeCtrl'
                    }
                },
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })

            // HOME MOST RECENT
            .state('app.home.most_recent', {
                url: '/most_recent',
                views: {
                    'home_content@app.home': {
                        templateUrl: 'templates/home_most_recent.html',
                        controller: 'RecipeCtrl',
                        // ogni volta che parte da questo stato farà questa funzione
                        resolve: {
                            // carica le ricette
                            postPromise: ['Recipe', function(recipes) {
                                console.log("resolve home");
                                return recipes.getAll();
                            }],
                            // carica le collection
                            collectionPromise: ['Collection', '$stateParams', function(collections, $stateParams) {
                                return collections.getAll();
                            }],
                            // carica gli utenti seguiti
                            followingUsersPromise: ['User', 'Auth', function(User, Auth) {
                                return User.getFollowingUsers(Auth.currentUser().id);
                            }]
                        }
                    }
                }
            })

            // HOME MOST TASTED
            .state('app.home.most_tasted', {
                url: '/most_tasted',
                views: {
                    'home_content@app.home': {
                        templateUrl: 'templates/home_most_tasted.html',
                        controller: 'RecipeCtrl',
                        // ogni volta che parte da questo stato farà questa funzione
                        resolve: {
                            //stampa delle ricette
                            //TODO - stampa delle ricette piu assaggiate
                            recipePromise: ['Recipe', function(recipes) {
                                console.log("resolve home");
                                return recipes.getAll("trialsCount");
                            }]
                        }
                    }
                }
            })

            // HOME TRENDING
            .state('app.home.trending', {
                url: '/trending',
                views: {
                    'home_content@app.home': {
                        templateUrl: 'templates/home_trending.html',
                        controller: 'RecipeCtrl',
                        // ogni volta che parte da questo stato farà questa funzione
                        resolve: {
                            //stampa delle ricette
                            //TODO - stampa delle ricette piu assaggiate
                            postPromise: ['Recipe', function(recipes) {
                                console.log("resolve home");
                                return recipes.getAll();
                            }]
                        }
                    }
                }
            })

            // HOME MOST COMMENTED
            .state('app.home.most_commented', {
                url: '/most_commented',
                views: {
                    'home_content@app.home': {
                        templateUrl: 'templates/home_most_commented.html',
                        controller: 'RecipeCtrl',
                        // ogni volta che parte da questo stato farà questa funzione
                        resolve: {
                            //stampa delle ricette
                            //TODO - stampa delle ricette piu assaggiate
                            postPromise: ['Recipe', function(recipes) {
                                console.log("resolve home");
                                return recipes.getAll();
                            }]
                        }
                    }
                }
            })
            
            // HOME
            .state('app.near_recipes', {
                url: '/near_recipes',
                views: {
                    'content@app': {
                        templateUrl: 'templates/near_recipes.html',
                        controller: 'NearRecipesCtrl'
                    }
                },
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })

            // FAVORITE RECIPES
            .state('app.favorite_recipes', {
                url: '/favorite_recipes',
                views: {
                    'content@app': {
                        templateUrl: 'templates/favorite_recipes.html',
                        controller: 'RecipeCtrl',
                        resolve: {
                            recipePromise: ['Recipe', 'Auth', function(recipes, Auth) {
                                return recipes.getUserUpvotedRecipes(Auth.currentUser().id);
                            }]
                        }
                    }
                },
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })

            // VIEWED RECIPES
            .state('app.viewed_recipes', {
                url: '/viewed_recipes',
                views: {
                    'content@app': {
                        templateUrl: 'templates/viewed_recipes.html',
                        controller: 'RecipeCtrl',
                        resolve: {
                            recipePromise: ['Recipe', 'Auth', function(recipes, Auth) {
                                return recipes.getUserViewedRecipes(Auth.currentUser().id);
                            }]
                        }
                    }
                },
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })

            // FOLLOWED COLLECTIONS
            .state('app.followed_collections', {
                url: '/followed_collections',
                views: {
                    'content@app': {
                        templateUrl: 'templates/followed_collections.html',
                        controller: 'FollowingCollectionsCtrl'
                    }
                },
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })

            // TASTED RECIPES
            .state('app.tasted_recipes', {
                url: '/tasted_recipes',
                views: {
                    'content@app': {
                        templateUrl: 'templates/tasted_recipes.html',
                        controller: 'RecipeCtrl',
                        resolve: {
                            recipePromise: ['Recipe', 'Auth', function(recipes, Auth) {
                                return recipes.getUserTriedRecipes(Auth.currentUser().id);
                            }]
                        }
                    }
                },
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })

            // LOGIN PAGE ==========================================================
            .state('login', {
                url: '/login?token',// query param (opzionale)
                templateUrl: 'templates/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', '$stateParams', 'Auth', function($state, $stateParams, Auth) {
                    if ($stateParams.token) {
                        Auth.saveToken($stateParams.token);
                    }
                    if (Auth.isLoggedIn()) {
                        $state.go('app.home.most_recent');
                    }
                }]
            })

            // PROFILE PAGE ==========================================================
            // PROFILE ROOT (DEFAULT)
            .state('app.profile', {
                url: '/profile/{id}',
                views: {
                    'content@app': {
                        templateUrl: 'templates/profile.html',
                        controller: 'UserProfileCtrl',
                        resolve: {
                            userPromise: ['User', '$stateParams', function(user, $stateParams) {
                                return user.getUserById($stateParams.id);
                            }],
                            recipePromise: ['Recipe', '$stateParams', function(recipes, $stateParams) {
                                return recipes.getUserRecipes($stateParams.id, null, //nel caso positivo fai nulla...
                                    function(response) { //nel caso di errore
                                        Recipe.recipes = []; //svuoto l'array delle ricette
                                        return true; //prosegui comunque
                                });
                            }]
                        }
                    },
                    'profile_content@app.profile': {
                        templateUrl: 'templates/profile_recipes.html',
                        controller: 'RecipeCtrl'
                    }
                }
            })
            // PROFILE COLLECTIONS
            .state('app.profile.collections', {
                url: '/collections',
                views: {
                    'profile_content@app.profile': {
                        templateUrl: 'templates/profile_collections.html',
                        controller: 'CollectionCtrl',
                        resolve: {
                            collectionPromise: ['Collection', '$stateParams', function(Collection, $stateParams) {
                                return Collection.getUserCollections($stateParams.id);
                            }]
                        }
                    }
                }
            })
            // PROFILE FOLLOWERS
            .state('app.profile.followers', {
                url: '/followers',
                views: {
                    'profile_content@app.profile': {
                        templateUrl: 'templates/profile_followers.html',
                        controller: 'UserProfileFollowerUsersCtrl',
                        resolve: {
                            // carica gli utenti seguiti
                            followerUsersPromise: ['User', '$stateParams', function(User, $stateParams) {
                                return User.getFollowerUsers($stateParams.id); 
                            }]
                        }
                        
                    }
                }
            })
            // PROFILE FOLLOWING
            .state('app.profile.following', {
                url: '/following',
                views: {
                    'profile_content@app.profile': {
                        templateUrl: 'templates/profile_following.html',
                        controller: 'UserProfileFollowingUsersCtrl',
                        resolve: {
                            // carica gli utenti seguiti
                            followingUsersPromise: ['User', '$stateParams', function(User, $stateParams) {
                                return User.getFollowingUsers($stateParams.id); 
                            }]
                        }
                    }
                }
            })

            // RECIPE PAGE =======================================================
            .state('app.recipe', {
                url: '/recipe/{id}',
                views: {
                    'content@app': {
                        templateUrl: 'templates/recipe_detail.html',
                        controller: 'RecipeCtrl',
                        // ogni volta che parte da questo stato farà questa funzione
                        resolve: {
                            recipePromise: ['Recipe', '$stateParams', function(recipes, $stateParams) {
                                return recipes.getRecipe($stateParams.id);
                            }]
                        }
                    }
                }
            })

            // COLLECTION PAGE =======================================================
            .state('app.collection', {
                url: '/collection/{id}',
                views: {
                    'content@app': {
                        templateUrl: 'templates/collection_detail.html',
                        controller: 'CollectionDetailCtrl',
                        // ogni volta che parte da questo stato farà questa funzione
                        resolve: {
                            collectionPromise: ['Collection', '$stateParams', function(collections, $stateParams) {
                                return collections.getCollection($stateParams.id);
                            }]
                        }
                    }
                }
            })

        // DEFAULT PAGE ==========================================================

        $urlRouterProvider.otherwise(function($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("app.home.most_recent");
        });


        // disabilito la necessità dei # nelle URL
        $locationProvider.html5Mode(true);

    }]);