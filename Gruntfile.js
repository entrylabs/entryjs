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
            test: {
                files: ['test/**/*.js'],
                tasks: [
                    'karma'
                ]
            },
            js: {
                files: ['src/**'],
                tasks: [
                    'closureCompiler:targetName',
                    'karma',
                    'jshint'
                ]
            }
        },
        jshint: {
            all: [
                'src/**/*.js'
            ],
            options: {
                jshintrc: true
            }
        },
        karma: {
            options: {
                frameworks: ['mocha', 'chai'],
                files: [
                    'test_util/*.js',
                    'extern/jquery/jquery.js',
                    'extern/blockly/blockly_compressed.js',
                    'dist/entry.js'
                ]
            },
            unit: {
                configFile: 'karma.conf.js',
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
                    language_in: 'ECMASCRIPT5',
                    language_out: 'ECMASCRIPT5',
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
                        compilation_level: 'SIMPLE_OPTIMIZATIONS',
                        language_in: 'ECMASCRIPT5',
                        language_out: 'ECMASCRIPT5'
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
        'jshint'
    ]);

    grunt.registerTask('development', [
        'closureCompiler:targetName',
        'karma',
        'jshint',
        'concurrent'
    ]);

    grunt.registerTask('closure', ['closureCompiler']);
};
