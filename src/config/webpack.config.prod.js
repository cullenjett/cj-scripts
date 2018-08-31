const autoprefixer = require('autoprefixer')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

const { fromAppRoot } = require('../utils/from-app-root')
const { getAppEnv } = require('../utils/get-app-env')

const env = getAppEnv()

if (env.raw.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: [fromAppRoot('/config/polyfills'), fromAppRoot('/src/index.js')],
  output: {
    path: fromAppRoot('/build'),
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: env.raw.PUBLIC_URL + '/',
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: fromAppRoot('/src'),
      },
      {
        test: /\.(js|jsx)$/,
        include: fromAppRoot('/src'),
        loader: require.resolve('babel-loader'),
        options: {
          compact: true,
        },
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: ['last 2 versions', 'not ie < 11'],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          require.resolve('sass-loader'),
          require.resolve('import-glob-loader'),
        ],
      },
      {
        test: /\.graphql?$/,
        loader: require.resolve('webpack-graphql-loader'),
        options: {
          removeUnusedFragments: true,
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new webpack.DefinePlugin(env.forWebpackDefinePlugin),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new LodashModuleReplacementPlugin(),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}
