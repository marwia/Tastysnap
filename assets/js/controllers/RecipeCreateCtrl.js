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
    'Product', // servizio per i prodotti
    'Ingredient', // servizio per gli ingredienti
    'RecipeStep', // servizio per i passi
    'Auth', // servizio per l'autenticazione
    '$filter',
    'FileUploader', // per il file upload
    '$http',
    function ($scope, $state, Recipe, Product, Ingredient, RecipeStep, Auth, $filter, FileUploader, $http) {

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;
		
        // espongo le categorie delle ricette estraendole dal servizio
        // il caricamento della categorie viene eseguito ad ogni
        // ingresso nello stato in cui si crea una ricetta
        $scope.recipeCategories = Recipe.recipeCategories;

        // espongo il tipo di dosaggio preso sempre dal servizio dedicato alle ricette
        $scope.dosageTypes = Recipe.dosagesTypes;
        // espongo il metodo per ricercare i prodotti per nome
        $scope.searchProductsByName = Product.searchProductsByName;
        
        $scope.unitsOfMeasure = Ingredient.unitsOfMeasure;
        
        // variabili per tenere traccia del completameto della crezione di una ricetta
        $scope.createSum = 1;
        $scope.createProgress = 0;
        
        $scope.isCreating = false;

        // Ritorna il colore dominante del canvas che contiene
        // la prima delle immagini caricate
        $scope.getCoverImageDominanatColor = function (canvas) {
            var colorThief = new ColorThief();
            $scope.recipeToCreate.dominantColor = $scope.rgbToHex(colorThief.getColor(canvas))
            console.log($scope.recipeToCreate.dominantColor);
        };

        /**
         * Funzione che converte una array di colori RGB in hex.
         * Fonte: http://codepen.io/TepigMC/pen/jnmkv
         */
        $scope.rgbToHex = function (rgb) {
            var r = parseInt(rgb[0]),
                g = parseInt(rgb[1]),
                b = parseInt(rgb[2]);
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        $scope.recipeToCreate = {
            title: "",
            preparationTime: 15,
            dosagesFor: "",
            dosagesType: "",
            category: "",
            description: "",
            coverImageUrl: "",
            dominantColor: "",
            blurredCoverImageUrl: "",
        };
		
        // TODO: bisogna memorizzare degli oggetti più complessi...
        $scope.ingredient_groups =
        [{
            name: "",
            ingredients: [{
                name: "",
                quantity: "",
                unitOfMeasure: "",
                product: {}
            }]
        }];
        
        $scope.recipe_steps =
            [{
                seq_number: 1,
                description: ""
        }];
		
        // metodo per aggiungere banalmente un gruppo di ingredienti
        $scope.addIngredientGroup = function () {
            $scope.ingredient_groups
                .push({
                    name: "",
                    ingredients: [{
                        name: "",
                        quantity: "",
                        unitOfMeasure: "",
                        product: {}
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
                unitOfMeasure: "",
                product: {}
            });
        };

        $scope.onSelect = function ($item, $model, $label, ingredient) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
            ingredient.product = $item.id;
        };

        /**
         * Rimuovi un ingrediente da un gruppo di ingredienti.
         */
        $scope.removeIngredient = function (group_index, ingredient_index) {
            $scope.ingredient_groups[group_index].ingredients.splice(ingredient_index, 1);
        };
        
        // metodo per aggiungere banalmente un passo alla ricetta
        $scope.addRecipeStep = function () {
            $scope.recipe_steps
                .push({
                    seq_number: $scope.recipe_steps.length + 1,
                    description: ""
                });
        };

        /**
         * Esegui l'upload di tutte le immagini in attesa di upload.
         */
        $scope.createRecipe = function () {
            
            $scope.isCreating = true;
            
            setTimeout(function () {
            // calcolo del totale delle create che saranno eseguite
            $scope.createSum = 1 // ricetta stessa
                        + coverImageUploader.queue.length * 2 // immagine di copertina + quella sfocata
                        + otherImageUploader.queue.length // altre immagini
                        + $scope.ingredient_groups.length; // gruppi di ingredienti
                        + $scope.recipe_steps.length; // numero di passi nella preparazione
            
            for (var i in $scope.ingredient_groups) {
                $scope.createSum += $scope.ingredient_groups[i].ingredients.length // numero di ingredienti di ogni gruppo
            }
            
            
            //crea ricetta
            Recipe.create($scope.recipeToCreate, function (response) {
  
                // salvo l'esito della creazione della ricetta
                $scope.recipeToCreate = response.data;
                $scope.createProgress++;
                
                // creo i passi per la preparazione
                createRecipeSteps();
                
                // crea gruppi di ingredienti
                createIngredientGroups();
 
                // carico l'immagine di copertina (compresa quella sfocata)
                coverImageUploader.uploadAll();
                
                // carico le altre immagini aggiuntive
                otherImageUploader.uploadAll();

            });
            }, 3000);
        };
        
        /**
         * Osserva la variabile che indica il progresso della creazione della ricetta.
         */
        $scope.$watch("createProgress", function(newValue, oldValue) {

            if ($scope.createProgress >= $scope.createSum) {// fine della creazione della ricetta
                $state.go("app.recipe", { id: $scope.recipeToCreate.id });
            }
        });
        
        /**
         * Crea tutti i passi per la ricetta.
         */
        function createRecipeSteps() {
            for (var i = 0; i < $scope.recipe_steps.length; i++) {
                RecipeStep.create(
                    $scope.recipeToCreate,
                    $scope.recipe_steps[i],
                    function () {// success
                        $scope.createProgress++;
                });
            }
        }
        
        /**
         * Crea tutti gruppi di ingredienti per la ricetta.
         */
        function createIngredientGroups() {
            for (var i = 0; i < $scope.ingredient_groups.length; i++) {
                
                //Se il gruppo non ha nome allora lo setto a " "
                if (!$scope.ingredient_groups[i].name) {
                    $scope.ingredient_groups[i].name = " ";
                }
                
                Ingredient.createIngredientGroup(
                    $scope.recipeToCreate,
                    $scope.ingredient_groups[i],
                    createIngredients);// success
            }
        }

        /**
         * Crea tutti gli ingredienti per un gruppo di ingredienti.
         */
        function createIngredients(ingredientGroup) {
            $scope.createProgress++;
            for (var k = 0; k < ingredientGroup.ingredients.length; k++) {
                                
                //crea per ogni gruppo di ingredienti gli ingredienti
                Ingredient.createIngredient(
                    ingredientGroup.ingredients[k],
                    ingredientGroup,
                    function (response) {
                        $scope.createProgress++;
                        console.info(response);
                    });
            }
        }
        
        // File uploading (configuration)
        
        var coverImageUploader = $scope.coverImageUploader = new FileUploader({
            alias: 'image',
            method: 'put',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
                'x-csrf-token': $http.defaults.headers.common['x-csrf-token']
            }
        });

        var otherImageUploader = $scope.otherImageUploader = new FileUploader({
            alias: 'image',
            method: 'put',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
                'x-csrf-token': $http.defaults.headers.common['x-csrf-token']
            }
        });

        // FILTERS
        var coverImageFilter = {
            name: 'coverImageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';

                return '|jpg|png|jpeg|'.indexOf(type) !== -1 // filter file type
                    && this.queue.length < 1; // max 1 image
            }
        }

        var otherImageFilter = {
            name: 'otherImageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';

                return '|jpg|png|jpeg|'.indexOf(type) !== -1 // filter file type
                    && this.queue.length < 10; // max 10 images
            }
        }
        
        /**
         * Serve a ridurre la qualità e la risoluzione di un elemento del 
         * file uploader.
         * @param {FileItem} fileItem
         * @param {Function} successCallback(canvas)
         */
        function reduceImageSizeAndQuality(fileItem, successCallback) {
            var file = fileItem._file;
            
            // Crea il canvas
            var canvas = document.createElement("canvas");
            // Create a file reader
            var reader = new FileReader();
            
            // Set the image once loaded into file reader
            reader.onload = function (e) {
                // Create an image
                var img = document.createElement("img");
                img.onload = onLoadImage;
                img.src = e.target.result;
            }

            reader.readAsDataURL(file);

            function onLoadImage() {
                // Setta le massime dimensioni
                var sizes = setImageSize(this, 1024, 1024);
                canvas.width = sizes.width;
                canvas.height = sizes.height;
                
                // Trasforma il file in canvas
                canvas.getContext("2d").drawImage(this, 0, 0, sizes.width, sizes.height);
                
                // Comprimi il canvas in JPEG e riduci qualità
                var dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                
                // Transofm to blob
                var blob = dataURItoBlob(dataUrl);
                fileItem._file = blob;

                if (successCallback)
                    successCallback(canvas);
            }
        }
        
        // Set filters
        coverImageUploader.filters.push(coverImageFilter);
       
        // CALLBACKS

        coverImageUploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };

        coverImageUploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
            reduceImageSizeAndQuality(fileItem, function (canvas) {
                // ottengo il colore dominante dell'immagine di copertina
                $scope.getCoverImageDominanatColor(canvas);
            });
        };

        coverImageUploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };

        coverImageUploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            // aggiorno dinamicamente l'url per l'upload
            item.url = '/api/v1/recipe/' + $scope.recipeToCreate.id + '/upload_cover_image';
        };

        coverImageUploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };

        coverImageUploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };

        coverImageUploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };

        coverImageUploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };

        coverImageUploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };

        coverImageUploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.createProgress++;
            console.info('onCompleteItem', fileItem, response, status, headers);
        };

        coverImageUploader.onCompleteAll = function () {
            console.info('onCompleteAll');
            
            // prendo la prima immagine
            var file = coverImageUploader.queue[0]._file;
            // Crea il canvas
            var canvas = document.createElement("canvas");
            // Create a file reader
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function (e) {
                // Create an image
                var img = document.createElement("img");
                img.onload = onLoadImage;
                img.src = e.target.result;
            }

            reader.readAsDataURL(file);

            function onLoadImage() {
                canvas.width = this.width;
                canvas.height = this.height;
                
                // Aggiungo la sfocatura e trasferisco l'immagine sul canvas
                StackBlur.image(this, canvas, 70, false);

                // Comprimi il canvas in JPEG e riduci qualità
                var dataUrl = canvas.toDataURL("image/jpeg", 0.7);

                // Transofm to blob
                var blob = dataURItoBlob(dataUrl);

                Recipe.uploadBlurImage(blob, $scope.recipeToCreate, function (response) {
                    $scope.createProgress++;
                    //$scope.recipeToCreate = response.data;
                    console.info($scope.recipeToCreate);
                    

                }, function (response) {
                    console.info("error", response)
                });
            }
        };

        console.info('uploader', coverImageUploader);
        
        // Other image uploader
        
        otherImageUploader.filters.push(otherImageFilter);

        otherImageUploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
            reduceImageSizeAndQuality(fileItem);
        };

        otherImageUploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            // aggiorno dinamicamente l'url per l'upload
            item.url = '/api/v1/recipe/' + $scope.recipeToCreate.id + '/upload_image';
        };
        
        otherImageUploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.createProgress++;
        };

        otherImageUploader.onCompleteAll = function () {
            console.info("otherImageUploader - onCompleteAll");
        }
        
        
        // Helpers

        /**
         * Ricava le dimensioni dell'immagine riducendola proporzionalmente.
         * @param {Image} img
         * @param {Int} MAX_WIDTH
         * @param {Int} MAX_HEIGHT
         * @return {Object} sizes
         */
        var setImageSize = function (img, MAX_WIDTH, MAX_HEIGHT) {
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

            return { width: width, height: height };
        }
        
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

            return new Blob([ia], { type: mimeString });
        }
        
        var init = function () {
            // inizializzazione del controller
            Ingredient.GetIngredientUnitOfMeasure();
        };
        // and fire it after definition
        init();


    }]);