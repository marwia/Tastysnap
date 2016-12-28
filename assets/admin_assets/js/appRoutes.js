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
angular.module('adminAppRoutes', []).config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        // Dichiaro i vari stati dell'app
        $stateProvider

            /**
             * Stato genitore organizzato in 3 view.
             */
            .state('main', {
                url: '/admin',
                abstract: true,
                views: {
                    'main': { template: '<div ui-view></div>' }
                },
                resolve: {
                    hasPermission: ['Auth', '$window', function (Auth, $window) {
                        return Auth.getPermission(null, function(response) {
                            // in case of no permissions
                            $window.location.href = '/app';
                        });
                    }]
                }

            })

            .state('main.user_mngmnt', {
                url: '/user_mngmnt',
                templateUrl: 'admin_assets/templates/user_mngmnt.html',
                controller: 'UserMngmntCtrl',
                resolve: {
                    userPromise: ['User', function (User) {
                        console.log("getUsers");
                        return User.search('a', null, null, function (response) {
                            console.info("success", response);
                        }, function (response) {
                            console.info("errore", response)
                        });
                    }]
                }
            })

            .state('main.recipe_mngmnt', {
                url: '/recipe_mngmnt',
                templateUrl: 'admin_assets/templates/recipe_mngmnt.html',
                controller: 'RecipeMngmntCtrl',
                resolve: {
                    recipePromise: ['Recipe', function (Recipe) {
                        return Recipe.getRecipes();
                    }]
                }
            })

            .state('main.collection_mngmnt', {
                url: '/collection_mngmnt',
                templateUrl: 'admin_assets/templates/collection_mngmnt.html',
                controller: 'CollectionMngmntCtrl',
                resolve: {
                    collectionPromise: ['Collection', function (Collection) {
                        return Collection.getCollections();
                    }]
                }
            })

        // DEFAULT PAGE ==========================================================
        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get("$state");
            var Auth = $injector.get("Auth");

            if (Auth.isLoggedIn())
                $state.go("main.user_mngmnt");

        });


        // disabilito la necessità dei # nelle URL
        $locationProvider.html5Mode(true);

    }]);