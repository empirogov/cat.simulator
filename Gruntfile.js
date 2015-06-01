'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: {
                src: ['dist/*']
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/', src: '*', dest: 'dist/', filter: 'isFile'}
                ]
            }
        },
        concat: {
            dist: {
                src: [
                    'src/js/**/*.js',
                    'src/js/application.js'
                    ],
                dest: 'dist/js/application.js'
            }
        },
        uglify: {
            production: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/js/application.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        watch: {
            complete: {
                files: [
                    'src/**/*.*'
                ],
                tasks: ['default'],
                options: {
                    interrupt: true,
                    debounceDelay: 1000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default', ['clean:dist', 'copy', 'concat', 'uglify']);

};
