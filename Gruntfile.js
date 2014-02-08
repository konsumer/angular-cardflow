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
			},
			'default':{
				'files':[
					{'expand': true, 'flatten': true, 'filter': 'isFile', 'src': ['examples/**'], 'dest': 'out/'},
					{'src': ['cardflow.js'], 'dest': 'out/'},
				]
			}
		},
		'clean': {
			'page': ['.grunt/temp/'],
			'default': ['out/'],
		},
		'uglify': {
			'page': {
				'files': {
					'.grunt/temp/cardflow.min.js': ['cardflow.js']
				}
			},
			'default': {
				'files': {
					'out/cardflow.min.js': ['cardflow.js']
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
			},
			'default': {
				'expand': true,
				'cwd': 'out/',
				'src': ['*.css', '!*.min.css'],
				'dest': 'out/',
				'ext': '.min.css'
			}
		}
	});


	// copy files to temp dir
	// uglify coverflow.js
	// push to gh-pages

	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('default', 'Minify sources out put in out/', ['clean:default', 'copy:default', 'cssmin:default', 'uglify:default']);
	grunt.registerTask('page', 'Publish examples with minified source to github pages', ['clean:page', 'copy:page', 'cssmin:page', 'uglify:page', 'gh-pages']);

};