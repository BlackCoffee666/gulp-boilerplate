const dirs = { src: 'src', dest: 'build' };

module.exports = {
  entry: ['babel-polyfill', `./${dirs.src}/scripts/app.js`],
  watch: false,
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-function-bind']
        },
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
};
