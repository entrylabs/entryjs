module.exports = function(grunt) {
    'use strict';

    const ClosureCompiler = require('google-closure-compiler').compiler;

    grunt.initConfig({
        concurrent: {
            tasks: ['watch'],
            options: {
                logConcurrentOutput: true,
            },
        },
        watch: {
            test: {
                files: ['test/**/*.js'],
                tasks: ['karma'],
            },
            js: {
                files: ['src/**'],
                tasks: ['closureCompiler:targetName', 'karma', 'jshint', 'less'],
            },
        },
        less: {
            options: {
                compress: false,
            },
            development: {
                files: {
                    'dist/entry.css': 'src/css/*.less',
                },
            },
        },
        jshint: {
            all: ['src/**/*.js'],
            options: {
                jshintrc: true,
                ignores: ['src/blocks/*.js'],
            },
        },
        karma: {
            options: {
                frameworks: ['mocha', 'chai'],
                files: [
                    'http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js',
                    'test_util/*.js',
                    'extern/lang/ko.js',
                    'extern/blockly/blockly_compressed.js',
                    'extern/util/static.js',
                    'extern/util/filbert.js',
                    'extern/util/bignumber.min.js',
                    'node_modules/jquery/jquery.js',
                    'node_modules/createjs-easeljs/lib/easeljs-0.8.2.min.js',
                    'node_modules/createjs-soundjs/lib/soundjs-0.6.2.min.js',
                    'node_modules/createjs-preloadjs/lib/preloadjs-0.6.2.min.js',
                    'dist/entry.js',
                    'src/workspace/block_entry.js',
                ],
            },
            unit: {
                configFile: 'karma.conf.js',
                files: [{ src: ['test/**/*.js'] }],
            },
        },
        closureCompiler: {
            options: {
                compilerFile: ClosureCompiler.COMPILER_PATH,
                checkModified: true,
                compilerOpts: {
                    create_source_map: 'entry.js.map',
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5',
                    language_out: 'ECMASCRIPT5',
                    formatting: 'pretty_print',
                },
            },
            targetName: {
                src: ['src/entry.js', 'src/**/*.js', '!src/workspace/block_entry.js'],
                dest: 'dist/entry.js',
            },
            dist: {
                options: {
                    compilerOpts: {
                        compilation_level: 'SIMPLE_OPTIMIZATIONS',
                        language_in: 'ECMASCRIPT5',
                        language_out: 'ECMASCRIPT5',
                    },
                },
                expand: false,
                src: ['src/entry.js', 'src/**/*.js'],
                dest: 'dist/entry.min.js',
                ext: '.min.js',
            },
        },
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-closure-tools');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.option('force', true);

    // Default tasks.
    grunt.registerTask('default', ['closureCompiler', 'karma', 'jshint', 'less']);

    grunt.registerTask('development', [
        'watch',
        'closureCompiler:targetName',
        'karma',
        'concurrent',
    ]);

    grunt.registerTask('test', ['karma']);

    grunt.registerTask('closure', ['closureCompiler']);

    grunt.registerTask('build', ['closureCompiler', 'less']);
};
