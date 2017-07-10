var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/msal.module.js',
    output: {
        filename: 'dist/ngMsal.js',
        library: 'ngMsal',
        libraryTarget: 'umd'
    },
    target: 'node',
    devtool: 'inline-source-map',
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
        ]
    },
    externals: [nodeExternals()]
};