module.exports = function(grunt) {

	grunt.initConfig({
		'gh-pages': {
			'options': {
				'base': 'examples'
			},
			'src': ['**']
		},
		'connect': {
			'server': {
				'options': {
					'port': 9001,
        			'base': 'examples',
        			'keepalive':true
				},
			},
		}
	});

	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('page', 'Publish examples to github pages', ['gh-pages']);
	grunt.registerTask('server', 'Run local static webserver for examples', ['connect']);
	grunt.registerTask('serve', ['connect:server']);
	grunt.registerTask('default', ['page']);

};