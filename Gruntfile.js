module.exports = function(grunt) {

	grunt.initConfig({
		'gh-pages': {
			'options': {
				'base': '.grunt/temp'
			},
			'src': ['**']
		},
		'copy': {
			'page':{
				'files':[
					{expand: true, src: ['examples/**'], dest: '.grunt/temp/'},
				]
			}
		},
		'uglify': {
			'page': {
				'files': {
					'.grunt/temp/cardflow.min.js': ['cardflow.js']
				}
			}
		}
		'connect': {
			'server': {
				'options': {
					'port': 9001,
					'hostname': '*',
        			'base': 'examples',
        			'keepalive':true
				},
			},
		}
	});


	// copy files to temp dir
	// uglify coverflow.js
	// push to gh-pages

	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('page', 'Publish examples to github pages', ['copy:page', 'uglify:page', 'gh-pages']);
	grunt.registerTask('server', 'Run local static webserver for examples', ['connect']);
	grunt.registerTask('serve', ['connect:server']);
	grunt.registerTask('default', ['page']);

};