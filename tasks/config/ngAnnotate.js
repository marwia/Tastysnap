/**
 * Rebuild angularjs dependency injection annotations with ng-annotate.
 *
 * ---------------------------------------------------------------
 *
 * Add, remove and rebuild angularjs dependency injection annotations
 * for client-side javascript `assets`.
 *
 * For usage docs see:
 * 		https://github.com/mgol/grunt-ng-annotate
 *
 */
module.exports = function(grunt) {
    
    /**
     * Attenzione al vincolo sul nome di questa configurazione,
     * deve essere proprio "ngAnnotate" e così anche il 
     * nome del file.
     */   
    grunt.config.set("ngAnnotate", {
        // configurazione per l'app angular
        sampleApp: {
            files: [
                {
                    expand: true, // Unknown option
                    src: ['.tmp/public/concat/production.js'],
                    ext: '.annotated.js', // Dest filepaths will have this extension.
                    extDot: 'last',       // Extensions in filenames begin after the last dot
                }
            ]
        }

    });
    

    grunt.loadNpmTasks('grunt-ng-annotate');
};