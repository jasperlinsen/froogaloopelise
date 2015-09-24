/*global module:false*/
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '',
		/* Uglify JS files and compact them. */
		uglify: {
			'default' : {
				src: ['src/**.js'],
				dest: 'dist/vimeo.froogaloopelise.min.js'
			}
		},
		/* Compile all sass */
		compass: {
			'default': {
				options: {
					sassDir: "src/",
					cssDir: "dist/",
					outputStyle: "compressed"
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9'],
				cascade: false
			},
			css: {
				expand: true,
				flatten: true,
				src: 'dist/*.css',
				dest: 'dist/'
			},
		},
		/* Check JS files for lint errors */
		jshint: {
			'default': ['dist/site.min.js']
		},
		/* Check CSS files for lint errors */
		csslint: {
			'default': ['css/*.css']
		},
		/* Create a watch task to watch live files */
		watch: {
			options: { livereload: true },
			livereload: {
				files: ['src/**'],
			},
			scripts: {
				files: ['src/**.js'],
				tasks: ['uglify']
			},
			css: {
				files: ['src/**.scss'],
				tasks: ['compass', 'autoprefixer']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	
	// These plugins are not from the grunt contrib
	grunt.loadNpmTasks('grunt-autoprefixer');
	
	
	// Keep watch of files
	grunt.registerTask('watching', ['compile', 'watch']);
	
	// Default task
	grunt.registerTask('default', ['compile']);
	// General task
	grunt.registerTask('compile', ['uglify', 'compass', 'autoprefixer']);
	
	
	// Specific compile and check lint for JS
	grunt.registerTask('check', ['uglify', 'compass', 'csslint', 'jshint']);
	// Specific compile and check lint for JS
	grunt.registerTask('check-js', ['uglify', 'jshint']);
	// Specific compile and check lint for CSS
	grunt.registerTask('check-css', ['compass', 'autoprefixer', 'csslint']);

};
