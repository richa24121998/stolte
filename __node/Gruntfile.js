module.exports = function (grunt) {
 	"use strict";

  	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
    	assets: "../web/assets/site/",
        jshint: {
            options: {

            },
            beforeconcat: [
                'Gruntfile.js',
                '../__source/stick.engine/js/libraries/*.js',
                '../__source/stick.site/js/libraries/*.js',

            ],
            afterconcat: [
                /*'<%= assets %>js/app.js'*/
            ]
        },//jshint
		sass: {
			dist: {
				options: {
					outputStyle: "compressed",
                    implementation: require('node-sass'),
					sourceMap: true
				},
				files: {
					"<%= assets %>css/app.css": "../__source/stick.app.scss"
				}
			}
		},  //sass
		uglify: {
			app: {
				options: {
					sourceMap: true,
				},
				files: [{
					'<%= assets %>js/app.js' :
						[
							'../__source/stick.engine/js/**/*.js',
							'../__source/stick.engine/combo/**/*.js',
							'../__source/stick.site/js/**/*.js',
							'../__source/stick.site/combo/**/*.js'
						]
				}]
			}
		},//uglify

		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1,
                keepSpecialComments: 0
			},
			target: {
				files: {
					"<%= assets %>css/app.css": "<%= assets %>css/app.css"
				}
			}
		},//cssmin

		watch: {
			grunt: {
				files: ['Gruntfile.js'],
				tasks: ['all']
			},
			sass: {
				files: [
						'../__source/stick.engine/scss/**/*.scss',
						'../__source/stick.engine/combo/**/*.scss',
						'../__source/stick.site/scss/**/*.scss',
						'../__source/stick.site/combo/**/*.scss'

				],
				tasks: ['sass', 'cssmin']
			},
			js: {
				files: [
							'../__source/stick.engine/js/**/*.js',
							'../__source/stick.engine/combo/**/*.js',
							'../__source/stick.site/js/**/*.js',
							'../__source/stick.site/combo/**/*.js'
			],
				tasks: ['uglify']
			}

		} //watch
	});

    require('load-grunt-tasks')(grunt);

	grunt.registerTask('all', ['sass', 'uglify','cssmin']);
	grunt.registerTask('default', ['all', 'watch']);

}; //module.exports