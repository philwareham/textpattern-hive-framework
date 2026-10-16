const js = require('@eslint/js');

module.exports = [
    {
        files: ['**/*.js'],

        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly',
                console: 'readonly'
            }
        },

        rules: {
            ...js.configs.recommended.rules
        }
    }
];
