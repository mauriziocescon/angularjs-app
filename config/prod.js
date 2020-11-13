// tslint:disable:object-literal-sort-keys max-line-length no-console
const webpack = require('webpack');
const path = require('path');
const {merge} = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./base.js');

module.exports = (env) => {
  return merge(commonConfig(env), {

    mode: 'production',

    plugins: [

      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
        },
      }),

      new MiniCssExtractPlugin(),

      // bundle analyzer
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
      }),
    ],

    module: {

      rules: [

        // creates style nodes from JS strings
        // translates CSS into CommonJS
        // compiles Sass to CSS
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: (resourcePath, context) => {
                  // publicPath is the relative path of the resource to the context
                  // e.g. for ./css/admin/main.css the publicPath will be ../../
                  // while for ./css/main.css the publicPath will be ../
                  return path.relative(path.dirname(resourcePath), context) + '/';
                },
              },
            },
            {loader: 'css-loader', options: {modules: false, sourceMap: true}},
            {loader: 'resolve-url-loader', options: {absolute: true}},
            {loader: 'sass-loader', options: {sourceMap: true}},
          ],
        },

        // images loader
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          use: [
            {loader: 'file-loader', options: {name: '[name].[hash].[ext]'}},
          ],
        },
      ],
    },

    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].[fullhash].js',
    },
  });
};
