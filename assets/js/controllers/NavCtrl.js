/**
 * assets/js/controllers/NavCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per la navbar, serve a esporre le funzioni
 * e gli oggetti del servizio per l'autenticazione durante
 * la gestione della navbar.
 */
angular.module('NavCtrl', []).controller('NavCtrl', [
	'$scope',
	'$stateParams',
	'Auth',//service
	'User',//service
	'$http',
	'$location',
	'$uibModal',
	'UserEngagement',
	'Collection',
	'toastr',
	'$timeout',
	function ($scope, $stateParams, Auth, User, $http, $location, $uibModal, UserEngagement, Collection, toastr, $timeout) {
		// Espongo i metodi del Auth service
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.q = $stateParams.q;// query di ricerca
		$scope.logOut = Auth.logOut;

        /**
         * Pezzo di codice che serve ad aggiornare la query nella
         * navbar.
         */
		$scope.$on('$locationChangeSuccess', function (event) {
			$scope.q = $stateParams.q;// query di ricerca
			// azzero la query di ricerca se esco dalla pagina "ricerca"
			if ($location.path().indexOf("app/search") == -1)
				$scope.q = "";
		});

		// Espongo i metodi e oggetti del User service
		$scope.currentUser = User.currentUser;
		$scope.getUserProfileImage = User.getUserProfileImage;

        /**
         * Modale per la motivazione dell'utente a creare la sua prima ricetta.
         */
		if ($scope.currentUser.recipesCount == 0) {
			var lastDate = UserEngagement.getDate(UserEngagement.date_strings[0]);
			var diff = new Date() - new Date(lastDate);

			if (isNaN(diff) == true || diff >= 6 * 60 * 60 * 1000) {//6 ore
				$timeout(function () {
					var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'templates/create_first_recipe_modal.html',
						controller: function ($uibModalInstance, $scope) {
							// passaggio paramteri
							$scope.currentUser = User.currentUser;

							// azioni possibili all'interno della modale
							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						},
						size: 'md'
					});

					modalInstance.result.then(null, function () {
						console.info('Modal dismissed at: ' + new Date());
						// salvataggio della data di visualizzazione della modale
						UserEngagement.saveDate(UserEngagement.date_strings[0], new Date());
					});
				}, 5 * 1000);// 5s
			}
		}

        /**
         * Modale per la motivazione dell'utente a creare la sua prima raccolta.
         */
		if ($scope.currentUser.collectionsCount == 0
			&& $scope.currentUser.recipesCount > 0) {
			var lastDate = UserEngagement.getDate(UserEngagement.date_strings[1]);
			var diff = new Date() - new Date(lastDate);

			if (isNaN(diff) == true || diff >= 6 * 60 * 60 * 1000) {//6 ore

				$timeout(function () {
					var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'templates/create_first_collection_modal.html',
						controller: function ($uibModalInstance, $scope) {
							// passaggio paramteri
							$scope.currentUser = User.currentUser;

							// azioni possibili all'interno della modale
							$scope.cancel = function () {

								var createCollectionmodalInstance = $uibModal.open({
									animation: true,
									templateUrl: 'templates/collection_create_modal.html',
									controller: function ($uibModalInstance, $scope) {
										// passaggio paramteri
										$scope.loading = false;
										// creazione di una nuova collection
										$scope.collection = {
											title: "",
											description: "",
											isPrivate: false
										};

										// azioni possibili all'interno della modale

										// crea
										$scope.ok = function () {
											$scope.loading = true;

											Collection.create($scope.collection,
												function (response) {
													// close modal
													$uibModalInstance.close(response.data);
												}, function (response) {
													// errore
													$scope.loading = false;
												});
										};

										// annulla
										$scope.cancel = function () {
											$uibModalInstance.dismiss('cancel');
										};

									},
									size: 'lg'
								});

								// aggiorno i risultati
								createCollectionmodalInstance.result.then(function (collection) {
									toastr.success('Raccolta creata e ricetta aggiunta');
									// aggiungo subito la nuova raccolta
									Collection.userCollections.push(collection);
									Collection.collections.push(collection);
									// la raccolta è stata creata e la ricetta è stata aggiunta
									$uibModalInstance.close();
								});

								$uibModalInstance.dismiss('cancel');

							};

						},
						size: 'md'
					});

					modalInstance.result.then(null, function () {
						console.info('Modal dismissed at: ' + new Date());
						// salvataggio della data di visualizzazione della modale
						UserEngagement.saveDate(UserEngagement.date_strings[1], new Date());
					});
				}, 5 * 1000);// 5s
			}
		}

		var init = function () {
			var currentDate = new Date();
			var toastTitle, toastBody, toastType;

			if (currentDate.getHours() > 18) {// dinner
				toastTitle = "Fame?";
				toastBody = "E' orario di cena, cosa vuoi preparare?<br><a href='/app/search?q=&m=recipe&f=eyJzZWxlY3RlZFByb2R1Y3RzIjpbXSwic2VsZWN0ZWRDYXRlZ29yaWVzIjpbInNlY29uZGkgcGlhdHRpIl0sInRpbWVWYWx1ZSI6bnVsbCwibnV0cmllbnRGaWx0ZXJzIjpbXSwic2VsZWN0ZWRTb3J0TW9kZSI6IkFTQyIsInNlbGVjdGVkU29ydE9wdGlvbklkeCI6OCwic2VsZWN0ZWRTb3J0T3B0aW9uIjoidGVtcG8ifQ%3D%3D' class='btn btn-warning btn-sm'>Cerca secondi piatti</a>";
				toastType = "dinnerToast";
			} else if (currentDate.getHours() > 11) {// lunch
				toastTitle = "Fame?";
				toastBody = "E' orario di pranzo, cosa vuoi preparare?<br><a href='/app/search?q=&m=recipe&f=eyJzZWxlY3RlZFByb2R1Y3RzIjpbXSwic2VsZWN0ZWRDYXRlZ29yaWVzIjpbInByaW1pIHBpYXR0aSJdLCJ0aW1lVmFsdWUiOm51bGwsIm51dHJpZW50RmlsdGVycyI6W10sInNlbGVjdGVkU29ydE1vZGUiOiJBU0MiLCJzZWxlY3RlZFNvcnRPcHRpb25JZHgiOjgsInNlbGVjdGVkU29ydE9wdGlvbiI6InRlbXBvIn0%3D' class='btn btn-warning btn-sm'>Cerca primi piatti</a>";
				toastType = "lunchToast";

			} else if (currentDate.getHours() > 5) {// breakfast
				toastTitle = "Fame?";
				toastBody = "E' orario di colazione, cosa vuoi preparare?<br><a href='/app/search?q=&m=recipe&f=eyJzZWxlY3RlZFByb2R1Y3RzIjpbXSwic2VsZWN0ZWRDYXRlZ29yaWVzIjpbImRlc3NlcnQgZSB0b3J0ZSIsIm1hcm1lbGxhdGUgZSBjb25zZXJ2ZSJdLCJ0aW1lVmFsdWUiOm51bGwsIm51dHJpZW50RmlsdGVycyI6W10sInNlbGVjdGVkU29ydE1vZGUiOiJBU0MiLCJzZWxlY3RlZFNvcnRPcHRpb25JZHgiOjgsInNlbGVjdGVkU29ydE9wdGlvbiI6InRlbXBvIn0%3D' class='btn btn-warning btn-sm'>Cerca dolci e marmellate</a>";
				toastType = "breakfastToast";
			}

			//Verifico se posso mostrare il toast
			if (toastType != null) {
				var lastDate = UserEngagement.getDate(toastType);
				var diff = new Date() - new Date(lastDate);

				if (isNaN(diff) == true || diff >= 2 * 60 * 60 * 1000) {//2 ore
					$timeout(function () {
						toastr.info(toastBody, toastTitle, {
							allowHtml: true,
							toastClass: 'toast-black'
						});
						// salvo la data di visualizzazione per non mostrare lo stesso toast per 2 ore
						UserEngagement.saveDate(toastType, new Date());
					}, 60 * 1000);// 60s
				}
			}
		}
		// and fire it after definition
		init();


	}]);