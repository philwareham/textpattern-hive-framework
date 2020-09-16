const distDir = __dirname + '/themes/hive_framework';

const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [
        './scss/app.scss',
    ],
    output: {
        path: distDir,
        filename: '.Trashes'
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new StyleLintPlugin({
            configFile: '.stylelintrc.yml',
            syntax: 'scss',
            context: 'scss',
            files: '**/*.scss',
            failOnError: false,
            quiet: false
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/main.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: 'templates',
                    from: '**/*',
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS modules.
                    { loader: 'css-loader', options: { importLoaders: 2 } },
                    // Run postCSS actions.
                    { loader: 'postcss-loader', options: { plugins: [require('autoprefixer')] } },
                    // Compiles Sass to CSS.
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                outputStyle: 'expanded'
                            }
                        }
                    }
                ]
            },
            {
                // Bundle images.
                test: /\.(gif|jpe?g|png|svg|webp)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: './img/[name].[ext]'
                    }
                },
            }
        ]
    }
};
