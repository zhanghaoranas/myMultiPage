const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

/**
 * 
 * @description basePath 下所有的js文件的路径
 * @param {string} basePath 
 */
function getFileDir(basePath) {
    const fileDir = glob.sync(basePath +'**/*.js');
    if (fileDir.length == 0) {
        throw Error(basePath + '路径下没有js文件,请检查');
    }
    return fileDir;
}  
/**
 * 
 * @param {*} basePath 
 * @param {*} entryFileDir
 * @description 获取路径映射 
 */
function getDirMap(basePath, entryFileDir) {
    const dirMap = {};
    entryFileDir.forEach((item,index) => {
        const dir = item.replace(basePath, '').split('/');
        dir.pop();
        dirMap[dir.join('/')] = getPath('.' + item);
    });
    return dirMap;
}

/**
 * 
 * @param {string} j entry对象的key.
 * @returns {string} template. 
 * @description 如果目录中存在模板则使用目录中的模板否则使用通用模板。
 */
function getHTMLTemplate(i) {
    const template = glob.sync(`./src/views/${i}/*.html`)[0]
    if (!template) {
        return glob.sync('./src/template/index.html')[0];
    }
    return template;
}
/**
 * 
 * @param {*} routeName
 * @description 生成 HtmlWebpackPlugin
 */
function createHtmLWebpackPlugin(dirFragment) {
    return dirFragment.map(i => (
        new HtmlWebpackPlugin(
            {
            filename: `${i}.html`,
            template: getHTMLTemplate(i),
            inject: true,
            chunks: [i],
        }
        )    
    ));
}

function getPath(pathStr) {
    return path.resolve(__dirname, pathStr);
}


// 基础路径
const basePath = './src/views/'; 
const entryFileDir = getFileDir(basePath);
const dirMap = getDirMap(basePath, entryFileDir);
const dirFragment = Object.keys(dirMap);

// webpack 基础配置
const webpackBaseConf = {
    entry: dirMap,
    output: {
        filename: 'js/[name].js',
        path: getPath('../dist'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
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
        new VueLoaderPlugin(),
        ...createHtmLWebpackPlugin(dirFragment),
        new AddAssetHtmlPlugin({
            filepath:require.resolve('normalize.css'),
            outputPath: 'css/',
            publicPath: '/css',
            typeOfAsset: 'css',
        }),
    ],
    resolve: {
        extensions: ['.js', '.scss', '.png', 'jpg'],
        alias: {
            'common': getPath('../src/assets/common'),
            'images': getPath('../src/assets/images'),
            'json': getPath('../src/assets/json'),
            'fonts': getPath('../src/assets/fonts'),
        },
    },
    stats: 'errors-only'
}

module.exports = webpackBaseConf;