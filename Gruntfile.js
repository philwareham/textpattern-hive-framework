module.exports = function (grunt)
{
    'use strict';

    // Load all Grunt tasks.
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Set up paths.
        paths: {
            src: {
                sass: 'scss/',
                fonts: 'node_modules/hive-framework/src/assets/fonts/',
                images: 'img/',
                js: 'node_modules/hive-framework/src/assets/js/',
                templates: 'templates/'
            },
            dest: {
                css: 'themes/hive-framework-<%= pkg.version %>/assets/css/',
                fonts: 'themes/hive-framework-<%= pkg.version %>/assets/fonts/',
                images: 'themes/hive-framework-<%= pkg.version %>/assets/img/',
                js: 'themes/hive-framework-<%= pkg.version %>/assets/js/',
                templates: 'themes/hive-framework-<%= pkg.version %>/'
            }
        },

        // Bundle up the JavaScript.
        browserify: {
            development: {
                src: [
                    '<%= paths.src.js %>app.js'
                ],
                dest: '<%= paths.dest.js %>app.js',
                options: {
                    browserifyOptions: {
                        debug: false
                    },
                    transform: [[
                        'babelify', {
                            'presets': ['@babel/preset-env']
                        }
                    ]]
                }
            }
        },

        // Clean theme directory to start afresh.
        clean: [
            'themes/*'
        ],

        // Run some tasks in parallel to speed up the build process.
        concurrent: {
            dist: [
                'browserify',
                'copy',
                'css',
                'jshint'
            ]
        },

        copy: {
            // Copy fonts.
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.src.fonts %>',
                        src: '**',
                        dest: '<%= paths.dest.fonts %>'
                    }
                ]
            },
            // Copy Textpattern templates.
            html: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.src.templates %>',
                        src: '**',
                        dest: '<%= paths.dest.templates %>'
                    }
                ]
            },
            // Copy fonts.
            img: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.src.images %>',
                        src: '**',
                        dest: '<%= paths.dest.images %>'
                    }
                ]
            }
        },

        // Check code quality of Gruntfile.js and site-specific JavaScript using JSHint.
        jshint: {
            options: {
                bitwise: true,
                browser: true,
                curly: true,
                eqeqeq: true,
                esversion: 6,
                forin: true,
                globals: {
                    $: true,
                    console: true, // Comment this out for production code.
                    jQuery: true,
                    Zepto: true,
                    define: true,
                    module: true,
                    require: true,
                    autosize: true,
                    Prism: true
                },
                latedef: true,
                noarg: true,
                nonew: true,
                strict: true,
                undef: true,
                unused: true
            },
            files: [
                'Gruntfile.js',
                '<%= paths.src.js %>*.js'
            ]
        },

        // Add vendor prefixed styles and other post-processing transformations.
        postcss: {
            options: {
                processors: [
                    require('autoprefixer'),
                    require('cssnano')
                ]
            },
            dist: {
                src: '<%= paths.dest.css %>*.css'
            }
        },

        // Sass configuration.
        sass: {
            options: {
                implementation: require('sass'),
                outputStyle: 'expanded', // outputStyle = expanded, nested, compact or compressed.
                sourceMap: true
            },
            dist: {
                files: [
                    {'<%= paths.dest.css %>style.css': '<%= paths.src.sass %>app.scss'}
                ]
            }
        },

        // Validate CSS files via stylelint.
        stylelint: {
            options: {
                configFile: '.stylelintrc.yml'
            },
            src: ['<%= paths.src.sass %>**/*.{css,scss}']
        },

        // Minify `app.js`.
        uglify: {
            dist: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        '<%= paths.dest.js %>app.js': ['<%= paths.dest.js %>app.js']
                    }
                ]
            }
        },

        // Directories watched and tasks performed by invoking `grunt watch`.
        watch: {
            sass: {
                files: '<%= paths.src.sass %>**/*.scss',
                tasks: 'css'
            },
            js: {
                files: '<%= paths.src.js %>**',
                tasks: [
                    'jshint',
                    'browserify',
                    'uglify'
                ]
            },
            html: {
                files: [
                    '<%= paths.src.templates %>**'
                ],
                tasks: 'copy:html'
            }
        }

    });

    // Register tasks.
    grunt.registerTask('build', ['clean', 'concurrent', 'uglify']);
    grunt.registerTask('css', ['stylelint', 'sass', 'postcss']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('html', ['copy:html', 'copy:img']);
    grunt.registerTask('travis', ['build']);
};
