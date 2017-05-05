/**
 * assets/js/services/CollectionService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano 
 * le collezioni di ricette.
 */
angular.module('CollectionService', [])
	.factory('Collection', ['$http', 'Auth', 'User', function ($http, Auth, User) {

		var server_prefix = '/api/v1';

		// service body
		var o = {
			collections: [],
			userCollections: [],
			detailedCollection: {}, // one collection 
			sortOptions: ['undefined', 'viewsCount', 'followersCount', 'recipesCount'],
		};

        /**
         * Verifica se l'utente loggatto attualmente è l'autore della collection.
         */
		o.isCollectionAuthor = function (collection) {
			if (Auth.isLoggedIn) {
				if (Auth.currentUser().id == collection.author.id) {
					return true;
				}
			}
			return false;
		};

        /**
         * Metodo per richiedere una lista di collection.
         */
		o.getAll = function (order_by, skip, successCB, errorCB) {
			return $http.get(server_prefix + '/collection',
				{
					params: {
						'skip': skip,
						'order': order_by
					}
				}).then(function (response) {
					if (skip) {
						for (var i = 0; i < response.data.length; i++) {
							o.collections.push(response.data[i]);
						}
					} else {
						angular.extend(o.collections, response.data);
					}
					if (successCB)
						successCB(response);

				}, errorCB);
		};

        /**
         * Metodo per richiedere una lista di collection seguite da un utente.
         */
		o.getUserFollowingCollections = function (userId, order_by, skip, successCB, errorCB) {
			return $http.get(server_prefix + '/user/' + userId + '/following_collections',
				{
					params: {
						'skip': skip,
						'order': order_by
					}
				}).then(function (response) {
					if (skip) {
						for (var i = 0; i < response.data.length; i++) {
							o.collections.push(response.data[i]);
						}
					} else {
						angular.extend(o.collections, response.data);
					}
					if (successCB)
						successCB(response);

				}, errorCB);
		};

        /**
         * Metodo per eseguire una ricerca AVANZATA per titolo di raccolta.
         * @param {String} query - parte del titolo della raccolta
         * @param {Number} sort_by - numero che indica per cosa ordinare i risultati (in base all'array 'sortOptions')
         * @param {String} sort_mode - stringa che indica la modalità di ordinazione ASC o DESC
         * @param {Number} skip - numero di risultati da saltare, utile per la paginazione
         * @param {Boolean} reset - se true indica che i risultati devono sovrascrivere quelli
         * attuali, di default è false
         */
		o.search = function (query, sort_by, sort_mode, skip, reset, successCB, errorCB) {
			// parametri base
			var params = {
				where: {}
			};

			// parametri aggiuntivi
			if (typeof query != 'undefined' && query.length > 0)
				params.where["title"] = { "contains": query };

			if (sort_by != null && sort_by > 0)
				params["sort"] = o.sortOptions[sort_by] + " " + sort_mode;

			if (skip != null)
				params["skip"] = skip;

			return $http.get(server_prefix + '/collection',
				{
					params: params
				}).then(function (response) {
					if (skip) {
						for (var i = 0; i < response.data.length; i++) {
							o.collections.push(response.data[i]);
						}
					} else {
						if (reset)
							angular.copy(response.data, o.collections);
						else
							angular.extend(o.collections, response.data);
					}
					if (successCB)
						successCB(response);
				}, function (response) {
					// nessuna raccolta trovata? Pulisco tutto...
					angular.copy([], o.collections);
					if (errorCB)
						errorCB(response);
				});
		};

        /**
         * Metodo per eseguire una ricerca per id della raccolta.
         */
		o.searchById = function (id, successCB, errorCB) {
			var collection;
			// ricerco la raccolta nelle variabili locali
			for (var i = 0; i < o.collections.length; i++) {
				if (o.collections[i].id == id) {
					collection = o.collections[i];
					break;
				}
			}

			if (collection) return successCB({ data: [collection] });

			// se non ho trovato la raccolta, la richiedo al server
			return $http.get(server_prefix + '/collection', {
				params: {
					where: {
						"id": id
					}
				}
			}).then(function (response) {
				//angular.extend(o.collections, response.data);

				if (successCB)
					successCB(response);
			}, errorCB);
		};

        /**
         * Metodo per richiedere la lista di ricette di 
         * una data collection
         */
		o.getDetailedCollectionRecipes = function (successCB) {
			return $http.get(server_prefix + '/collection/' + o.detailedCollection.id + '/recipe')
				.then(function (response) {
					o.detailedCollection.recipes = [];
					angular.copy(response.data, o.detailedCollection.recipes);
					if (successCB)
						successCB(response);

				}, function errorCB(response) {

					console.log(response);
				});
		};

        /**
         * Metodo per richiedere la lista di ricette di 
         * una data collection
         */
		o.getCollectionRecipes = function (collection, limit, skip) {
			return $http.get(
				server_prefix + '/collection/' + collection.id + '/recipe',
				{
					params: {
						'skip': skip,
						'limit': limit
					}
				})
				.then(function (response) {
					collection.recipes = [];
					angular.copy(response.data, collection.recipes);

				}, function errorCB(response) {

					console.log(response);
				});
		};

        /**
         * Metodo per richiedere una lista di collection di un dato utente.
         */
		o.getUserCollections = function (userId, successCB, errorCB) {
			return $http.get(server_prefix + '/collection', {
				params: {
					where: {
						"author": userId
					}
				}
			}).then(function (response) {
				angular.copy(response.data, o.userCollections);

				if (successCB)
					successCB(response);
			}, errorCB);
		};

        /**
         * Metodo per cancellare una collection.
         */
		o.delete = function (collectionId, successCB, errorCB) {
			return $http.delete(
				server_prefix + '/collection/' + collectionId)
				.then(function (response) {
					User.currentUser.collectionsCount -= 1;
					if (successCB)
						successCB(response);
				}, errorCB);
		}

        /**
         * Metodo per cancellare una collection.
         */
		o.deleteCoverImage = function (collectionId, successCB, errorCB) {
			return $http.delete(
				server_prefix + '/collection/' + collectionId + '/cover_image')
				.then(successCB, errorCB);
		}

        /**
         * Metodo per richiedere una una collection tramite il suo id.
         */
		o.getCollection = function (collectionId) {
			return $http.get(server_prefix + '/collection/' + collectionId)
				.then(function (response) {
					angular.copy(response.data, o.detailedCollection);
				});
		};

        /**
         * Servizio per creare una collection.
         */
		o.create = function (collection, successCB, errorCB) {
			return $http.post(
				server_prefix + '/collection',
				collection)
				.then(function (response) {
					User.currentUser.collectionsCount += 1;

					if (User.user.id == User.currentUser.id)// profilo del loggato (proprio profilo)
						User.user.collectionsCount += 1;

					if (User.user.id == User.currentUser.id // profilo del loggato (proprio profilo)
						&& o.userCollections instanceof Array)
						// aggiungo la raccolta (visto che è l'array delle raccolte del profilo)
						o.userCollections.push(collection);

					if (successCB)
						successCB(response);

				}, errorCB);
		};

        /**
         * Metodo per verificare se l'utente loggato 
         * sta seguendo una raccolta.
         */
		o.areYouFollowing = function (collectionToCheck, successCB) {
			return $http.get(server_prefix + '/collection/' + collectionToCheck.id + '/following/')
				.then(function (response) {

					collectionToCheck.isFollowed = true;
					if (successCB)
						successCB(response);

				}, function (response) {
					collectionToCheck.isFollowed = false;
				});
		};

        /**
         * Servizio per aggiungere una ricetta ad una raccolta
         */
		o.follow = function (collection, successCB) {
			return $http.put(
				server_prefix + '/collection/' + collection.id + '/follow')
				.then(function (response) {

					collection.isFollowed = true;
					collection.followersCount++;
					successCB(response);

				}, function errorCB(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					//alert("Errore: " + response);
					console.log(response);
				});
		};

        /**
         * Metodo per smettere di seguire una raccolta.
         */
		o.unfollow = function (collection, successCB) {
			return $http.delete(server_prefix + '/collection/' + collection.id + '/follow')
				.then(function (response) {

					collection.followersCount--;
					collection.isFollowed = false;
					if (successCB)
						successCB(response);

				}, function errorCB(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					//alert("Errore: " + response);
					console.log(response);
				});
		};

        /**
        * Servizio per comunicare che una raccolta è stata vista
        * dall'utente loggato.
        * Disponibile solo su un dettaglio di una raccolta.
        */
		o.createView = function (collection) {
			return $http.post(
				server_prefix + '/collection/' + collection.id + '/view')
				.then(function (response) {
					if (response.status == 201) {// new view
						collection.viewsCount++;
					}
					collection.userView = response.data;
				});
		};

        /**
         * Servizio per aggiungere una ricetta ad una raccolta
         */
		o.addRecipeToCollection = function (recipe, collection, successCB, errorCB) {
			return $http.put(
				server_prefix + '/collection/' + collection.id + '/recipe/' + recipe.id,
				null)
				.then(function (response) {

					//recipe = response.data;
					if (successCB)
						successCB(response);

				}, errorCB);
		};

        /**
         * Servizio per rimuovere una ricetta da una raccolta
         */
		o.removeRecipeFromCollection = function (recipe, collection, successCB) {
			return $http.delete(
				server_prefix + '/collection/' + collection.id + '/recipe/' + recipe.id)
				.then(function (response) {

					if (successCB)
						successCB(response);

				}, function errorCB(response) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					//alert("Errore: " + response);
					console.log(response);
				});
		}

		o.update = function (collection, successCB, errorCB) {
			console.info("update", collection);
			return $http.put(
				server_prefix + '/collection/' + collection.id,
				collection)
				.then(function (response) {

					if (successCB)
						successCB(response);

				}, errorCB);

		}

        /**
         * Servizio per ricavare la foto casuale di una sua ricetta data una collection
        */
		o.getRandomCoverBlurredImage = function (collection) {
			if (collection.recipes && collection.recipes.length > 0) {
				var idx = Math.floor(Math.random() * collection.recipes.length) + 0;
				return collection.recipes[idx];
			}
			else {
				return null;//or sample image...
			}
		};


		return o;
	}]);