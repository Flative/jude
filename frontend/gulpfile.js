const gulp = require('gulp');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const gulpWebpack = require('gulp-webpack');

// Config file
const webpackConfig = require('./webpack.config');

gulp.task('webpack-dev-server', () =>
  new WebpackDevServer(webpack(webpackConfig.dev), {
    publicPath: webpackConfig.dev.output.publicPath,
    hot: true,
    historyApiFallback: true,
    quiet: false,
  }).listen(webpackConfig.dev.port, '0.0.0.0')
);

gulp.task('webpack:build', () => {
  return gulp.src(webpackConfig.APP_PATH.jude)
    .pipe(gulpWebpack(webpackConfig.prod))
    .pipe(gulp.dest('./static'))
});

gulp.task('webpack:build-silent', () => {
  return gulp.src(webpackConfig.APP_PATH.jude)
    .pipe(gulpWebpack(Object.assign({}, webpackConfig.prod, {
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: false,
      errorDetails: false,
      warnings: false,
      publicPath: false,
    })))
    .pipe(gulp.dest('./static'))
});

// Development server
gulp.task('default', ['webpack-dev-server']);

// Production build
gulp.task('build', ['webpack:build']);
gulp.task('build-silent', ['webpack:build-silent']);
