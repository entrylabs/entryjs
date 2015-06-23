module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        concurrent: {
            tasks: ['watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        watch: {
            js: {
                files: ['src/**'],
                tasks: ['closureCompiler', 'jshint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: [
                'src/**'
            ],
            options: {
                jshintrc: true
            }
        },
        closureCompiler: {
            options: {
                compilerFile: 'node_modules/closurecompiler/compiler/compiler.jar',
                checkModified: true,
                compilerOpts: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    formatting: 'pretty_print'
                }
            },
            targetName: {
                src: ['src/entry.js', 'src/**/*.js'],
                dest: 'dist/entry.js'
            },
            dist: {
                options: {
                    compilerOpts: {
                        compilation_level: 'SIMPLE_OPTIMIZATIONS'
                    }
                },
                expand: false,
                src: ['src/entry.js', 'src/**/*.js'],
                dest: 'dist/entry.min.js',
                ext: '.min.js'
            }
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-closure-tools');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default tasks.
    grunt.registerTask('default', [
        'closureCompiler',
        'jshint',
        'concurrent'
    ]);
    grunt.registerTask('closure', ['closureCompiler']);
};
