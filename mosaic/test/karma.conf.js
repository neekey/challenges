// Karma configuration
// Generated on Thu May 26 2016 20:41:12 GMT+1000 (AEST)

var Path = require( 'path' );
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

        client: {
            mocha: {
                timeout: 1000000
            }
        },


        // list of files / patterns to load in the browser
        files: [
            /* test tool using with mocha */
            '../node_modules/chai/chai.js',
            /* vendors the application requires */
            '../js/mosaic.js',
            '../js/image_reader.js',
            '../js/tile_render_orders.js',
            '../js/tile_render.js',
            '../js/tile_processor.js',
            '../js/tile_processor_worker.js',
            './test_utils.js',
            /* test cases */
            './**/*-spec.js',
            { pattern: '../js/**/*.*', included: false, served: true, watched: true },
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values:
        // - config.LOG_DISABLE
        // - config.LOG_ERROR
        // - config.LOG_WARN
        // - config.LOG_INFO
        // - config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        autoWatchBatchDelay: 1000,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        proxies: {
            '/js/tile_processor_worker.js': Path.resolve( __dirname, '../js/tile_processor_worker.js' ),
            '/color': 'http://localhost:8765/color'
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
    });
};
