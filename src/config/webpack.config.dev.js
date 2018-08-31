const autoprefixer = require('autoprefixer')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const webpack = require('webpack')

const { fromAppRoot } = require('../utils/from-app-root')
const { getAppEnv } = require('../utils/get-app-env')

const env = getAppEnv()

module.exports = {
  mode: 'development',
  bail: true,
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('webpack-hot-middleware/client') +
      '?path=/__webpack_hmr&reload=true',
    fromAppRoot('/src/index.js'),
  ],
  output: {
    path: fromAppRoot('/build'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: env.raw.PUBLIC_URL + '/',
  },
  module: {
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
          cacheDirectory: true,
        },
      },
      {
        test: /\.s?css$/,
        use: [
          require.resolve('style-loader'),
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
  plugins: [
    new webpack.DefinePlugin(env.forWebpackDefinePlugin),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new LodashModuleReplacementPlugin(),
    new ErrorOverlayPlugin(),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  performance: {
    hints: false,
  },
}
