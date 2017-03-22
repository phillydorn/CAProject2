const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools-configuration'));


const DEBUG = (process.env.NODE_ENV === 'development');

const env = {
  NODE_ENV: process.env.NODE_ENV,
};

const config = {
  context: path.join(__dirname, 'app'),
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  entry: {
    app: './app',
    vendor: [
      'react',
      'react-router',
      'redux',
      'react-dom',
      'lodash',
      'bluebird',
      'humps',
      'history',
    ],
  },

  resolve: {
    root: [path.join(__dirname, 'app'), path.join(__dirname, 'node_modules')],
  },
  output: {
    path: path.join(__dirname, 'dist/public'),
    publicPath: '/',
    filename: DEBUG ? '[name].js' : '[name].[chunkhash].js',
  },
  node: {
    Buffer: true,
    child_process: 'empty',
    fs: 'empty',
    net: 'empty',
    dns: 'empty',
    yamlparser: 'empty',
    tls: 'empty',
    dgram: 'empty',


  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
    webpackIsomorphicToolsPlugin,
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader?limit=25600',
      },
      {

        test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
        loader: 'imports?define=>false&this=>window',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=public/fonts/[name].[ext]',
      },
      {
        test: /\.json$/,
        loader: 'raw-loader',
      },
    ],
  },
};


if (DEBUG) {
  config.entry.dev = [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
  ];

  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filname: 'vendor.js',
    }),
  ]);
  config.output.publicPath = 'http://localhost:3001/static/';
  config.module.loaders[0].query = {
    env: {
      development: {
        presets: ['react-hmre'],
      },
    },
  };
} else {
  config.plugins = config.plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filname: '[name].[chunkhash].js',
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new AssetsPlugin({ path: path.join(__dirname, 'dist/public') }),
  ]);
}

module.exports = config;
