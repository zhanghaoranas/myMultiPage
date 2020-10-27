const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const fs = require('fs');
function getPath(pathStr) {
    return path.resolve(__dirname, pathStr);
}
module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../', // 更改url()中的路径
                    }
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader:'sass-loader',
                    options:{
                        data: fs.readFileSync(path.join(__dirname, '../src/assets/common/common.scss'))
                    }
                },
            ]
        }]
    },
    plugins:[
        new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[name].css',
            publicPath: '../assets/',
        })
    ]
})