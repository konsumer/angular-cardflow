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
					{'expand': true, 'flatten': true, 'filter': 'isFile', 'src': ['examples/**'], 'dest': '.grunt/temp/'},
					{'src': ['cardflow.js'], 'dest': '.grunt/temp/'},
				]
			}
		},
		'clean': {
			'page': ['.grunt/temp/'],
		},
		'uglify': {
			'page': {
				'files': {
					'.grunt/temp/cardflow.min.js': ['cardflow.js']
				}
			}
		},
		'cssmin': {
			'page': {
				'expand': true,
				'cwd': '.grunt/temp/',
				'src': ['*.css', '!*.min.css'],
				'dest': '.grunt/temp/',
				'ext': '.min.css'
			}
		},
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
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('server', 'Run local static webserver for examples', ['connect']);
	grunt.registerTask('default', 'Publish examples with minified source to github pages', ['clean:page', 'copy:page', 'cssmin:page', 'uglify:page', 'gh-pages']);

};