const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'production',
    bail: true,
    devtool: false,
    entry: {
        'MoePlayer': path.resolve(__dirname, '../src/main.js')
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'player.min.js',
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
        publicPath: '/'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.scss']
    },
    module: {
        strictExportPresence: true,
        rules: [{
            test: /\.js$/,
            use: [
                'template-string-optimize-loader',
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env'],
                    }
                }
            ]
        }, {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader', 
                    options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: true
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: path.join(__dirname, 'postcss.config.js')
                        }
                    }
                },
                'sass-loader'
            ]
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                'limit': 40000
            }
        }, {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        }]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'player.min.css'
        })
    ]
}