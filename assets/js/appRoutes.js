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
                // DASHBOARD STATE WITH 3 VIEWS ========================================
                .state('dashboard', {
                    url: '/dashboard',
                    views: {
                        '': { templateUrl: 'templates/dashboard.html',
                            controller: 'MasterCtrl'},
                        'navbar@dashboard': { templateUrl: 'partials/navbar.html' },
                        'sidebar@dashboard': { templateUrl: 'partials/sidebar.html' },
                        'content@dashboard': { templateUrl: 'templates/rdash.html' }
                    },
                    onEnter: ['$state', 'Auth', function($state, Auth){
                        if(!Auth.isLoggedIn()){
                            $state.go('login');
                        }
                    }]
                })
                
                .state('dashboard.recipe-create', {
                    url: '/recipe_create',
                    views: {
                        'content@dashboard': { 
                            templateUrl: 'templates/recipe-create.html',
                            controller: 'RecipeCreateCtrl',
                            // ogni volta che parte da questo stato farà questa funzione
                            resolve: {
                                postPromise: ['Recipe', function(recipes){
                                    return recipes.getAllRecipeCategories();
                                }],
                                dosageType: ['Recipe', function(recipes){
                                    return recipes.getAllDosageTypes();
                                }]
                            }
                        }
                    }
                })

                .state('dashboard.home', {
                    url: '/home',
                    views: {
                        'content@dashboard': { 
                            templateUrl: 'templates/recipes.html',
                            controller: 'RecipeCtrl',
                            // ogni volta che parte da questo stato farà questa funzione
                            resolve: {
                                postPromise: ['Recipe', function(recipes){
                                    return recipes.getAll();
                                }]
                            }
                        }
                    }
                })

                .state('dashboard.post', {
                    url: '/post/{id}',
                    views: {
                        'content@dashboard': { 
                            templateUrl: 'templates/post.html',
                            controller: 'PostsCtrl',
                            resolve: {
                                post: ['$stateParams', 'posts', function($stateParams, posts) {
                                    console.log("carico il post");
                                    return posts.get($stateParams.id);
                                }]
                            }
                        }
                    }
                })

                .state('dashboard.index2', {
                    url: '/index2',
                    views: {
                        'content@dashboard': { templateUrl: 'templates/rdash.html' }
                    } 
                })

                .state('dashboard.tables', {
                    url: '/tables',
                    views: {
                        'content@dashboard': { templateUrl: 'templates/tables.html' }
                    } 
                })

                // LOGIN PAGE ==========================================================
                .state('login', {
                    url: '/login?token',// query param (opzionale)
                    templateUrl: 'templates/login.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', '$stateParams', 'Auth', function($state, $stateParams, Auth){
                        if($stateParams.token) {
                            Auth.saveToken($stateParams.token);
                        }
                        if(Auth.isLoggedIn()) {
                            $state.go('dashboard');
                        }
                    }]
                })

                // REGISTER PAGE =======================================================
                .state('register', {
                    url: '/user/create',
                    templateUrl: 'templates/register.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'Auth', function($state, Auth){
                        if(Auth.isLoggedIn()){
                            $state.go('dashboard');
                        }
                    }]
                })

                // DEFAULT PAGE ==========================================================
                
                $urlRouterProvider.otherwise( function($injector, $location) {
                    var $state = $injector.get("$state");
                    $state.go("dashboard");
                });
                

        // disabilito la necessità dei # nelle URL
        $locationProvider.html5Mode(true);

}]);