// Accessing the path library using require(path)
const path = require('path') 
const webpack = require('webpack')

// Webpack plugin to extract CSS
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if(process.env.NODE_ENV === 'test') {
    require('dotenv').config({path : '.env.test'})
} else if(process.env.NODE_ENV === 'development') {
    require('dotenv').config({path : '.env.development'})
}

module.exports = (env) => {
    const isProduction = env === "production"
    // const CSSExtract = new ExtractTextPlugin('styles.css')
    const CSSExtract = new MiniCssExtractPlugin({
        path: path.resolve(__dirname, 'public/styles'),
        filename: 'styles.css'
    })

    return {
        entry: ['babel-polyfill', './src/app.js'], 
        output: {
            // The path should be absolute path. 
            path: path.resolve(__dirname, 'public/scripts'), 
            filename: 'bundle.js'
        },
    
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_module/, 
    
                    use: {
                        loader: 'babel-loader', 
                        options: {
                            presets: ['env', 'react'],
                            plugins: ['transform-class-properties', 
                                       'transform-object-rest-spread']
                        }
                    }
                }, 
                {
                    test: /\.s?css$/, 
                    use:[ MiniCssExtractPlugin.loader, 
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap : true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap:true
                        }
                    }
                ]
                }
        ]
        },
        plugins : [
            CSSExtract, 
            new webpack.DefinePlugin( { 
                'process.env.FIREBASE_API_KEY' : JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN' : JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_DATABASE_URL' : JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'process.env.FIREBASE_PROJECT_ID' : JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_STORAGE_BUCKET' : JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
                'process.env.FIREBASE_MESSAGING_SENDER' : JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER)
            })
        ],

        devServer: {
            // Absolute path that lets devserver know where folder that you are trying to server up lives
            contentBase: path.resolve(__dirname, 'public'),
            // Where the assets are
            publicPath: '/scripts/',
            historyApiFallback: true
        },
        devtool:isProduction ? 'source-map' : 'inline-source-map'
    }
}

