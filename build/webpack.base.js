const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
function getEntryRoute() {
    const entryRoute = glob.sync('./src/*/index.js');
    if (entryRoute.length == 0) {
        console.error('入口的数量为0。');
    }
    return entryRoute;
}
/**
 * 
 * @param {string} route 通过glob获取的路径。
 * @returns {string} 返回entry对象的key. 
 */
function getName(route) {
    return route.slice(6, -9);
}

/**
 * 
 * @param {string} j entry对象的key.
 * @returns {string} template. 
 */
function getTemplateFromPageConfig(j) {
    const template = glob.sync(`./src/${j}/${j}.html`)[0]
    if (!template) {
        console.error(`获取模板文件错误,请检查src/${j}/${j}.html文件是否存在`);
    }
    return template;
}

function getHtmLWebpackPluginforMutil(entryRoute) {
    return entryRoute.map(item => getName(item)).map(i => (
        new HtmlWebpackPlugin({
            filename: `${i}.html`,
            template: getTemplateFromPageConfig(i),
            inject: true,
            chunks: [i],
        })
    ));
}

function getEntry(entryRoute) {
    const entry = {};
    entryRoute.forEach(item => {
        entry[getName(item)] = item;
    });
    return entry;
}

function getPath(pathStr) {
    return path.resolve(__dirname, pathStr);
}

const webpackBaseConf = {
    entry: getEntry(getEntryRoute()),
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: '8197',
                    },
                },
            },
        ]
    },
    plugins: [
        ...getHtmLWebpackPluginforMutil(getEntryRoute()),
        new AddAssetHtmlPlugin({
            filepath:require.resolve('normalize.css'),
            outputPath: 'css/',
            publicPath: 'css/',
            typeOfAsset: 'css',
        }),
    ],
    resolve: {
        extensions: ['.js', '.scss', '.png', 'jpg'],
        alias: {
            'common': getPath('../assets/common'),
            'images': getPath('../assets/images'),
            'json': getPath('../assets/json'),
            'fonts': getPath('../assets/fonts'),
        },
    }
}

module.exports = webpackBaseConf;