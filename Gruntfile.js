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
                    'less'
                ]
            }
        },
        less: {
            options: {
                compress: false
            },
            development: {
                files: {
                    "dist/entry.css": "src/css/*.less"
                }
            }
        },
        jshint: {
            all: [
                'src/**/*.js'
            ],
            options: {
                jshintrc: true,
                ignores: ['src/blocks/*.js']
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
                    create_source_map: 'entry.js.map',
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5',
                    language_out: 'ECMASCRIPT5',
                    formatting: 'pretty_print'
                }
            },
            targetName: {
                src: ['src/entry.js', 'src/**/*.js', '!src/workspace/block_entry.js'],
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
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.option('force', true);

    // Default tasks.
    grunt.registerTask('default', [
        'closureCompiler',
        'karma',
        'less'
    ]);

    grunt.registerTask('development', [
        'watch',
        'closureCompiler:targetName',
        'karma',
        'concurrent'
    ]);

    grunt.registerTask('closure', ['closureCompiler']);
};
