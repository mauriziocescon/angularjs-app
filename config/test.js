// tslint:disable:object-literal-sort-keys max-line-length no-console
const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./base.js");

module.exports = (env) => {
    return webpackMerge(commonConfig(env), {

        entry: {
            app: "./src/main.ts",
            vendor: "./src/vendor.ts",
            test: "./src/test.spec.ts",
        },

        devtool: "cheap-module-eval-source-map",

        plugins: [

            // copy lazy
            new CopyPlugin([{
                from: "../lazy/dist",
            }]),

            new webpack.DefinePlugin({
                "process.env": {
                    "ENV": JSON.stringify("test"),
                },
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
                        {loader: "style-loader"},
                        {loader: "css-loader", options: {minimize: true, modules: false}},
                        {loader: "resolve-url-loader"},
                        {loader: "sass-loader", options: {sourceMap: true}},
                    ],
                },

                // images loader
                {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                    use: [
                        {loader: "file-loader", options: {name: "[name].[ext]"}},
                    ],
                },
            ],
        },

        output: {
            path: path.resolve(__dirname, "../dist"),
            filename: "[name].js",
        },
    });
};
