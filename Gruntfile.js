module.exports = function(grunt) {

	grunt.initConfig({
		'gh-pages': {
			options: {
				base: 'examples'
			},
			src: ['**']
		}
	});

	grunt.loadNpmTasks('grunt-gh-pages');

	grunt.registerTask('page', 'Publish examples to github pages', ['gh-pages']);
	grunt.registerTask('default', ['page']);

};