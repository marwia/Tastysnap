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
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        // Dichiaro i vari stati dell'app
        $stateProvider

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
                            userPromise: ['User', function (user) {
                                return user.getCurrentUser();
                            }]
                        }
                    },
                    'sidebar@app': { templateUrl: 'partials/sidebar.html' }
                },
                onEnter: ['$state', 'Auth', function ($state, Auth) {
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
                            postPromise: ['Recipe', function (recipes) {
                                return recipes.getAllRecipeCategories();
                            }],
                            dosageType: ['Recipe', function (recipes) {
                                return recipes.getAllDosageTypes();
                            }]
                        }
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
                onEnter: ['$state', 'Auth', function ($state, Auth) {
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
                            postPromise: ['Recipe', function (recipes) {
                                console.log("resolve home");
                                return recipes.getAll();
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
                        templateUrl: 'templates/home_most_tasted.html'
                    }
                }
            })
            
            // HOME TRENDING
            .state('app.home.trending', {
                url: '/trending',
                views: {
                    'home_content@app.home': {
                        templateUrl: 'templates/home_trending.html'
                    }
                }
            })
            
            // HOME MOST COMMENTED
            .state('app.home.most_commented', {
                url: '/most_commented',
                views: {
                    'home_content@app.home': {
                        templateUrl: 'templates/home_most_commented.html'
                    }
                }
            })

        // LOGIN PAGE ==========================================================
            .state('login', {
                url: '/login?token',// query param (opzionale)
                templateUrl: 'templates/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', '$stateParams', 'Auth', function ($state, $stateParams, Auth) {
                    if ($stateParams.token) {
                        Auth.saveToken($stateParams.token);
                    }
                    if (Auth.isLoggedIn()) {
                        $state.go('app.home');
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
                            userPromise: ['User', '$stateParams', function (user, $stateParams) {
                                return user.getUserById($stateParams.id);
                            }],
                            recipePromise: ['Recipe', '$stateParams', function (recipes, $stateParams) {
                                return recipes.getUserRecipes($stateParams.id);
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
                        templateUrl: 'templates/profile_collections.html'
                    }
                }
            })
        // PROFILE FOLLOWERS
            .state('app.profile.followers', {
                url: '/followers',
                views: {
                    'profile_content@app.profile': {
                        templateUrl: 'templates/profile_followers.html'
                    }
                }
            })
        // PROFILE FOLLOWING
            .state('app.profile.following', {
                url: '/following',
                views: {
                    'profile_content@app.profile': {
                        templateUrl: 'templates/profile_following.html'
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
                            recipePromise: ['Recipe', '$stateParams', function (recipes, $stateParams) {
                                return recipes.getRecipe($stateParams.id);
                            }]
                        }
                    }
                }
            })

        // DEFAULT PAGE ==========================================================
                
        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("app.home.most_recent");
        });
                

        // disabilito la necessità dei # nelle URL
        $locationProvider.html5Mode(true);

    }]);