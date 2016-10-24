const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();

const APP_PATH = {
  jude: 'src/index.js',
};
const BUILD_PATH = 'static/';
const PORT = 1111;

const common = {
  stats: {
    colors: true,
    reasons: true,
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
    }, {
      test: /\.css$/,
      loader: 'style!css',
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel',
    }, {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      loader: 'file-loader',
    }],
  },
  output: {
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.coffee'],
    alias: {
      utils: path.resolve('./src/utils'),
    },
    root: [
      path.resolve('./src'),
    ],
  },
};

// Development config
const dev = merge(common, {
  port: PORT,
  devtool: 'eval',
  entry: {
    jude: [
      `webpack-dev-server/client?http://0.0.0.0:${PORT}`,
      'webpack/hot/only-dev-server',
      path.join(__dirname, APP_PATH.jude),
    ],
  },
  output: {
    path: path.join(__dirname, BUILD_PATH),
    publicPath: `http://localhost:${PORT}/`,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new DashboardPlugin(dashboard.setData),
  ],
});

// Production config
const prod = merge(common, {
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
    }),
  ],
});

module.exports = { APP_PATH, dev, prod };
