module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
		'compileAssets',
		'concat',
        'ngAnnotate',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};
