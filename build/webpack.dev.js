const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.base.js');
const path = require('path');
const fs = require('fs');
module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        open: true,
        disableHostCheck: true,
        hot: true,
    },
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader:'sass-loader',
                    options:{
                        data: fs.readFileSync(path.join(__dirname, '../src/assets/common/common.scss'))
                    }
                }
            ]
        }, ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})