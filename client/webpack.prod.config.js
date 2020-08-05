const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// may be useful for quick start:
// https://generatewebpackconfig.netlify.app/
// https://createapp.dev/webpack
// $ npx webpack-cli init

module.exports = {
  // etnry
  entry: {
    main: "./src/index.js",
  },

  // multi-entry point (Multi Page App)
  // entry: {
  //   main: "./src/index.js",
  //   vendor: "./src/vendor.js",
  //   home: { import: "./src/contact.js", filename: "pages/[name][ext]" },
  //   about: { import: "./src/about.js", filename: "pages/[name][ext]" },
  // },

  // output
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "js/[name].[contenthash].js",
    /*filename: (pathData) => {
      return pathData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
    },*/
    // path relative to html doc, used to set up cdn delivery
    // e.g. "https://cdn.example.com/
    publicPath: "",
  },

  // multi-entry output
  //   output: {
  //     filename: "[name].bundle.js",
  //   },

  // mode
  mode: "production",

  // opt
  optimization: {
    minimizer: [/* new TerserJSPlugin({}),*/ new OptimizeCSSAssetsPlugin({})],
  },

  // loaders
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "assets",
            publicPath: "assets/",
          },
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },

      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
        },
      },
    ],
  },

  // plugins
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.[contenthash].css",
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "**/*",
        path.join(process.cwd(), "build/**/*"),
      ],
    }),
    new HtmlWebpackPlugin({
      title: "Task Manager",
      template: "./public/index.html",
      filename: "./index.html",
      description: "Manage your daily routine tasks with convenience.",
    }),
  ],
};
