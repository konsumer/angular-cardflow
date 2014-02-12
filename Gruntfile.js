module.exports = function(grunt) {
	grunt.initConfig({
		'gh-pages': {
			'options': {
				'base': 'dist/'
			},
			'src': ['**']
		},
		'clean': {
			'default': ['dist/', '.grunt', '.tmp'],
		},
		'useminPrepare': {
			'html': ['examples/*.html'],
			'options': {
				'dest': 'dist/'
			}
		},
		'usemin':{
			'html': ['dist/*.html']
		},
		'copy':{
			'default':{
				'files': [
					{'expand': true, 'cwd': 'examples/', 'src': ['*.html', '*.css'], 'dest': 'dist/'},
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-usemin');
	
	grunt.registerTask('default', 'Minify sources, output in out/', ['clean', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'copy', 'usemin']);
	grunt.registerTask('page', 'Publish minified examples to github pages', ['default', 'gh-pages']);
};