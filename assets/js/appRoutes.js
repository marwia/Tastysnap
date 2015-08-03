// assets/js/appRoutes.js
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
                    }  
                })

                .state('dashboard.home', {
                    url: '/home',
                    views: {
                        'content@dashboard': { 
                            templateUrl: 'templates/posts.html',
                            controller: 'MainCtrl',
                            // ogni volta che parte da questo stato farà questa funzione
                            resolve: {
                                postPromise: ['posts', function(posts){
                                    return posts.getAll();
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
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                            $state.go('dashboard');
                        }
                    }]
                })

                // REGISTER PAGE =======================================================
                .state('register', {
                    url: '/user/create',
                    templateUrl: 'templates/register.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                            $state.go('dashboard');
                        }
                    }]
                });

                $urlRouterProvider.otherwise( function($injector, $location) {
                    var $state = $injector.get("$state");
                    $state.go("dashboard");
                });

        // disabilito la necessità dei # nelle URL
        $locationProvider.html5Mode(true);

}]);