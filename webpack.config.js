   // webpack.config.js
   module.exports = {
    // ... other configurations
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // Add this option to ignore source map warnings
                        sourceMaps: false,
                    },
                },
            },
        ],
    },
};