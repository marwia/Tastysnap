/**
 * assets/js/controllers/RecipeCreateCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per la creazione di una ricetta.
 */
angular.module('RecipeCreateCtrl', []).controller('RecipeCreateCtrl', [
    '$scope', // lo scope
    '$state', // gestione degli stati dell'app (ui-router)
    'Recipe', // servizio per le ricette
    'Auth', // servizio per l'autenticazione
    '$filter',
    'FileUploader', // per il file upload
    '$http',
    function ($scope, $state, Recipe, Auth, $filter, FileUploader, $http) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;
		
        // espongo le categorie delle ricette estraendole dal servizio
        // il caricamento della categorie viene eseguito ad ogni
        // ingresso nello stato in cui si crea una ricetta
        $scope.recipeCategories = Recipe.recipeCategories;
        $scope.selected_category = $scope.recipeCategories[0];
        // espongo il tipo di dosaggio preso sempre dal servizio dedicato alle ricette
        $scope.dosageTypes = Recipe.dosagesTypes;
        $scope.selected_dosage_type = $scope.dosageTypes[0];

        $scope.dosagesFor;
        $scope.desscription;
        
        $scope.dominantColor;
        
        // Ritorna il colore dominante del canvas che contiene
        // la prima delle immagini caricate
        $scope.getCoverImageDominanatColor = function () {
            var coverImageCanvas = angular.element($('#myCanvas'))[0];
            console.log(coverImageCanvas);
            var colorThief = new ColorThief();
            console.log(colorThief.getColor(coverImageCanvas));
            $scope.dominantColor = colorThief.getColor(coverImageCanvas)
        };
        
        $scope.recipeToCreate = {
                title: "",
                dosagesFor: "",
                dosagesType: "",
                category: "",
                description: "",
                coverImageUrl: ""
            };
		
        // TODO: bisogna memorizzare degli oggetti più complessi...
        $scope.ingredient_groups =
        [{
            id: "0",
            title: "",
            ingredients: [{
                name: "",
                quantity: "",
                type: ""
            }]
        }];
		
        // metodo per aggiungere banalmente un gruppo di ingredienti
        $scope.addIngredientGroup = function () {
            $scope.ingredient_groups
                .push({
                    id: "0",
                    title: "",
                    ingredients: [{
                        name: "",
                        quantity: "",
                        type: ""
                    }]
                });
        };
        
        $scope.removeIngredientGroup = function (group_index) {
            $scope.ingredient_groups.splice(group_index, 1);
        };

        $scope.addIngredient = function (group_index) {
            $scope.ingredient_groups[group_index].ingredients.push({
                name: "",
                quantity: "",
                type: ""
            });
        };
        
        $scope.removeIngredient = function (group_index, ingredient_index) {
            $scope.ingredient_groups[group_index].ingredients.splice(ingredient_index, 1);
        };

        

        $scope.addRecipe = function () {
            // preparo l'oggetto ricetta da spedire al server...
            /*
            $scope.recipeToCreate = {
                title: $scope.title,
                dosagesFor: $scope.dosagesFor,
                dosagesType: $scope.selected_dosage_type,
                category: $scope.selected_category,
                description: $scope.description,
                coverImageUrl: ''
            };
            */
            
            $scope.recipeToCreate.title = $scope.title;
            $scope.recipeToCreate.description = $scope.description;
            $scope.recipeToCreate.dosagesFor = $scope.dosagesFor;
            $scope.recipeToCreate.dosagesType = $scope.selected_dosage_type;
            $scope.recipeToCreate.category = $scope.selected_category;
            console.log($scope.recipeToCreate);

            Recipe.create($scope.recipeToCreate, function (response) {
                $state.go('dashboard');
            });
        };
        
        // File uploading
        
        var uploader = $scope.uploader = new FileUploader({
            url: '/api/v1/recipe/image',
            alias: 'avatar',
            headers: {
                    Authorization: 'Bearer ' + Auth.getToken(),
                    'x-csrf-token': $http.defaults.headers.common['x-csrf-token']
                }
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            /*
            * Il seguente codice viene eseguito dopo che un file è stato
            * aggiunto alla coda e serve a ridimensionare l'immagine
            * e ridurre la sua qualità.
            */
            var file = fileItem._file;
            var dataUrl = "";
            // Create an image
            var img = document.createElement("img");
            // Create a file reader
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e)
            {
                img.src = e.target.result;
        
                var canvas = document.createElement("canvas");
                //var canvas = $("<canvas>", {"id":"testing"})[0];
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
        
                // Set Width and Height
                var MAX_WIDTH = 1024;
                var MAX_HEIGHT = 1024;
                var width = img.width;
                var height = img.height;
        
                if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                // Transofm the file to Canvas
                ctx.drawImage(img, 0, 0, width, height);
        
                dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                
                // Transofm to blob
                var blob = dataURItoBlob(dataUrl);
                fileItem._file = blob;
                
            }
            // Load files into file reader
            reader.readAsDataURL(file);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
            
            
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            // salvo il nome che il server ha dato al file
            $scope.recipeToCreate.coverImageUrl = response;
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
        
        /**
         * Converts data uri to Blob. Necessary for uploading.
         * @see
         *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
         * @param  {String} dataURI
         * @return {Blob}
         */
        var dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
        }
        

    }]);