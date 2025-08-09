const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const appConfig = require('./app.config.json');

// Đọc biến môi trường từ tệp .env hoặc từ DOTENV_CONFIG_PATH nếu được chỉ định
require('dotenv').config({
    path: process.env.DOTENV_CONFIG_PATH || '.env',
});

// Sử dụng giá trị mặc định nếu biến không tồn tại
const API_TARGET_DOMAIN =
    process.env.REACT_APP_API_TARGET_DOMAIN || 'http://inginx-uat.mservice.io:12345';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const GW_BASE_PATH = process.env.REACT_APP_GW_BASE_PATH || '/api/gateway';
console.log(`[webpack] Target domain: "${API_TARGET_DOMAIN}"`);
console.log(`[webpack] API base URL: "${API_BASE_URL}"`);
console.log(`[webpack] Gateway base path: "${GW_BASE_PATH}"`);

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].bundle.js',
        library: `${appConfig.name}`,
        libraryTarget: 'umd',
        publicPath: process.env.REACT_APP_PUBLIC_PATH || '/',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            [
                                '@babel/plugin-transform-runtime',
                                {
                                    regenerator: true,
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new Dotenv({
            path: './.env', // Đường dẫn đến tệp .env mặc định
            safe: false, // Cho phép tệp .env không tồn tại
            systemvars: true, // Cho phép sử dụng biến môi trường hệ thống
            defaults: false, // Không sử dụng tệp .env.defaults
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        port: 3000,
        historyApiFallback: true,
        allowedHosts: 'all',
        proxy: [
            {
                context: [API_BASE_URL, GW_BASE_PATH],
                target: API_TARGET_DOMAIN,
                changeOrigin: true,
                secure: false,
                hot: true,
                open: true,
                pathRewrite: (path, req) => {
                    // Chỉ giữ lại phần đường dẫn sau API_BASE_URL
                    if (path.startsWith(API_BASE_URL)) {
                        return path.replace(API_BASE_URL, '');
                    }
                    if (path.startsWith(GW_BASE_PATH)) {
                        return path.replace(GW_BASE_PATH, '');
                    }
                    return path;
                },
                onProxyReq: function (proxyReq, req, res) {
                    console.log(
                        '🔄 [PROXY] Forwarding:',
                        req.method,
                        req.url,
                        '→',
                        API_TARGET_DOMAIN + req.url
                    );
                },
                onProxyRes: function (proxyRes, req, res) {
                    console.log('✅ [PROXY] Response:', proxyRes.statusCode, req.url);
                },
                onError: function (err, req, res) {
                    console.error('❌ [PROXY] Error:', err.message, 'for', req.url);
                },
            },
        ],
    },
};
