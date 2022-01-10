// tslint:disable:object-literal-sort-keys max-line-length no-console
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = (env) => {
  return {

    entry: {
      vendors: './src/vendors.ts',
      app: './src/main.ts',
    },

    resolve: {
      // Add '.ts' and '.tsx' as a resolvable extension.
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.scss', '.html', '.json'],

      fallback: {
        url: require.resolve('url'),
        querystring: require.resolve('querystring-es3'),
      },
    },

    optimization: {
      concatenateModules: true,
      usedExports: true,
      splitChunks: {
        cacheGroups: {
          common: {
            test: /node_modules/,
            chunks: 'initial',
          },
        },
      },
    },

    plugins: [

      // environment variables
      new webpack.NormalModuleReplacementPlugin(/\.\.\/environments\/environment/, (resource) => {
        const newRequest = path.resolve(__dirname, `../src/environments/environment.${env.name}.ts`);
        if (fs.existsSync(newRequest)) {
          resource.request = resource.request + `.${env.name}`;
        }
      }),

      // hot module replacement
      new webpack.HotModuleReplacementPlugin({}),

      // clean dist folder
      new CleanWebpackPlugin(),

      new CopyPlugin({
        patterns: [
          {from: 'src/assets/i18n', to: 'assets/i18n'},
          {from: 'src/assets/imgs', to: 'assets/imgs'},
          {from: 'node_modules/angular-i18n/**_+(de|en|it).js', to: 'locales/[name][ext]'},
        ],
      }),

      // insert file dynamically
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        inject: 'head',
      }),

      new StyleLintPlugin({
        files: 'src/**/*.s?(a|c)ss',
      }),
    ],

    module: {

      rules: [

        // template loaders
        {
          test: /\.html?$/,
          exclude: /index.html$/,
          use: [
            {loader: 'html-loader', options: {esModule: true, minimize: true}},
          ],
        },

        // all files with '.js' '.ts' '.tsx' extensions will be handled by ts-loader
        {
          test: /\.(js|ts|tsx)?$/,
          exclude: [/node_modules/],
          use: [
            {loader: 'babel-loader', options: {cacheDirectory: true, presets: ['@babel/env']}},
            {loader: 'ts-loader'},
          ],
        },

        // preprocess
        {
          test: /\.(ts|tsx)?$/,
          exclude: [/node_modules/],
          enforce: 'pre',
          use: [
            {loader: 'tslint-loader', options: {emitErrors: false, formatter: 'stylish'}},
          ],
        },

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          test: /\.js$/,
          enforce: 'pre',
          use: [
            {loader: 'source-map-loader'},
          ],
        },
      ],
    },
  };
};
