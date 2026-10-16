module.exports = function (grunt) {
    'use strict';

    const fs = require('fs');
    const jshint = require('jshint').JSHINT;
    const terser = require('terser');

    // -------------------------------------------------------------------------
    // Load Grunt tasks
    // -------------------------------------------------------------------------

    [
        '@lodder/grunt-postcss',
        'grunt-contrib-clean',
        'grunt-contrib-copy',
        'grunt-purgecss',
        'grunt-replace-regex',
        'grunt-sass',
        'grunt-stylelint'
    ].forEach(grunt.loadNpmTasks);

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Set up paths.
        paths: {
            src: {
                sass: 'scss/',
                fonts: 'fonts/',
                images: 'img/',
                js: 'js/',
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

        // ---------------------------------------------------------------------
        // Clean
        // ---------------------------------------------------------------------

        clean: [
            'themes/*'
        ],

        // ---------------------------------------------------------------------
        // Copy assets
        // ---------------------------------------------------------------------

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
                        src: ['**', '!manifest.json'],
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
            },
            // Copy Leaflet (open-source interactive maps) files.
            leaflet: {
                files: [
                    {
                        '<%= paths.dest.js %>map.js': ['node_modules/leaflet/dist/leaflet.js'],
                        '<%= paths.dest.css %>map.css': ['node_modules/leaflet/dist/leaflet.css']
                    }
                ]
            }
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

        // Purge unused CSS from production.
        purgecss: {
            my_target: {
                options: {
                    content: [
                        '<%= paths.dest.templates %>**/*.txp',
                        '<%= paths.dest.js %>**/*.js'
                    ],
                    safelist: {
                        standard: [
                            'caps',
                            'comments_error',
                            'cpreview',
                            'error_message',
                            'footnote',
                            'list--no-bullets',
                            'success',
                            'error',
                            'alert-block success',
                            'alert-block error'
                        ],
                        greedy: [
                            /input$/,
                            /textarea$/,
                            /disabled$/
                        ]
                    }
                },
                files: {
                    '<%= paths.dest.css %>screen.css': ['<%= paths.dest.css %>screen.css']
                }
            }
        },

        // Generate version number automatically in theme manifest.json file.
        replace: {
            theme: {
                options: {
                    patterns: [
                        {
                            match: 'version',
                            replacement: '<%= pkg.version %>'
                        }
                    ]
                },
                files: [
                    {'<%= paths.dest.templates %>manifest.json': '<%= paths.src.templates %>manifest.json'}
                ]
            }
        },

        // ---------------------------------------------------------------------
        // Sass compilation
        // ---------------------------------------------------------------------

        sass: {
            options: {
                implementation: require('sass'),
                outputStyle: 'expanded', // outputStyle = expanded, nested, compact or compressed.
                sourceMap: false
            },
            dist: {
                files: [
                    {'<%= paths.dest.css %>screen.css': '<%= paths.src.sass %>screen.scss'},
                    {'<%= paths.dest.css %>print.css': '<%= paths.src.sass %>print.scss'}
                ]
            }
        },

        // ---------------------------------------------------------------------
        // CSS linting
        // ---------------------------------------------------------------------

        stylelint: {
            options: {
                configFile: '.stylelintrc.yml'
            },

            src: [
                '<%= paths.src.sass %>/**/*.scss',
                '<%= paths.src.sass %>/**/*.css'
            ]
        }
    });

    // -------------------------------------------------------------------------
    // JavaScript linting
    // -------------------------------------------------------------------------

    grunt.registerTask(
        'jshint',
        'Lint JavaScript with JSHint.',
        function () {
            const files = [
                'Gruntfile.js',
                `${grunt.config.get('paths.src.js')}/**/*.js`
            ];

            const options = {
                esversion: 11
            };

            let failed = false;

            grunt.file.expand(files).forEach((file) => {
                const source = fs.readFileSync(file, 'utf8');

                if (!jshint(source, options)) {
                    failed = true;

                    grunt.log.error(`JSHint failed: ${file}`);

                    jshint.errors.forEach((error) => {
                        if (error) {
                            grunt.log.error(
                                `  Line ${error.line}, column ${error.character}: ${error.reason}`
                            );
                        }
                    });
                }
            });

            if (failed) {
                return false;
            }

            grunt.log.ok('JSHint passed.');
        }
    );

    // -------------------------------------------------------------------------
    // JavaScript minification
    // -------------------------------------------------------------------------

    grunt.registerTask(
        'terser',
        'Minify JavaScript with Terser.',
        async function () {
            const done = this.async();

            const sourceFile = `${grunt.config.get('paths.src.js')}/app.js`;
            const destinationFile = `${grunt.config.get('paths.dest.js')}/app.js`;

            try {
                const source = fs.readFileSync(sourceFile, 'utf8');

                const result = await terser.minify(source, {
                    ecma: 2015,

                    compress: {
                        booleans_as_integers: true,
                        drop_console: true
                    },

                    format: {
                        comments: false
                    }
                });

                if (result.error) {
                    throw result.error;
                }

                fs.mkdirSync(
                    grunt.config.get('paths.dest.js'),
                    { recursive: true }
                );

                fs.writeFileSync(destinationFile, result.code);

                grunt.log.ok(`Minified ${sourceFile} -> ${destinationFile}`);

                done();
            } catch (error) {
                grunt.log.error(error);
                done(false);
            }
        }
    );

    // -------------------------------------------------------------------------
    // Composite tasks
    // -------------------------------------------------------------------------

    grunt.registerTask('css', [
        'stylelint',
        'sass',
        'postcss'
    ]);

    grunt.registerTask('css-production', [
        'stylelint',
        'sass',
        'purgecss',
        'postcss'
    ]);

    grunt.registerTask('html', [
        'copy:html',
        'copy:img'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'jshint',
        'replace',
        'terser',
        'css'
    ]);

    grunt.registerTask('build-production', [
        'clean',
        'copy',
        'jshint',
        'replace',
        'terser',
        'css-production'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
