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
                tasks: [
                    'closureCompiler',
                    'karma',
                    'jshint'
                ],
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
        karma: {
            options: {
                frameworks: ['mocha', 'chai'],
                files: [
                    'dist/entry.js'
                ]
            },
            unit: {
                configFile: 'karma.conf.js',
                port: 9999,
                singleRun: true,
                browsers: ['PhantomJS'],
                logLevel: 'ERROR',
                files: [
                    { src : ['test/**/*.js'] }
                ]
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
    grunt.loadNpmTasks('grunt-karma');

    // Default tasks.
    grunt.registerTask('default', [
        'closureCompiler',
        'karma',
        'jshint',
        'concurrent'
    ]);
    grunt.registerTask('closure', ['closureCompiler']);
};
