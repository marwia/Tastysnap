// assets/js/appRoutes.js
angular.module('appRoutes', []).config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        // Dichiaro i vari stati dell'app
        $stateProvider
                // HOME STATES AND NESTED VIEWS ========================================
                .state('app', {
                    url: '/app',
                    templateUrl: 'templates/app.html',
                    controller: 'MasterCtrl',
                })

                .state('app.home', {
                    url: '/home',
                    templateUrl: 'templates/home.html',
                    controller: 'MainCtrl',
                    // ogni volta che parte da questo stato farà questa funzione
                    resolve: {
                        postPromise: ['posts', function(posts){
                            return posts.getAll();
                        }]
                    }
                })

                .state('app.post', {
                    url: '/post/{id}',
                    templateUrl: 'templates/post.html',
                    controller: 'PostsCtrl',
                    resolve: {
                        post: ['$stateParams', 'posts', function($stateParams, posts) {
                            console.log("carico il post");
                            return posts.get($stateParams.id);
                        }]
                    }
                })

                .state('app.index2', {
                    url: '/index2',
                    templateUrl: 'templates/dashboard.html'
                })

                .state('app.tables', {
                    url: '/tables',
                    templateUrl: 'templates/tables.html'
                })

                // LOGIN PAGE ==========================================================
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                            $state.go('app.home');
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
                            $state.go('app.home');
                        }
                    }]
                });

                $urlRouterProvider.otherwise( function($injector, $location) {
                    var $state = $injector.get("$state");
                    $state.go("app.home");
                });

        // disabilito la necessità dei # nelle URL
        $locationProvider.html5Mode(true);

}]);