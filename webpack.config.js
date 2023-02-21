const path = require('path')

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './frontend/entry.jsx',
  output: {
    path: __dirname + '/app/assets/javascripts/me',
    filename: 'bundle.js',
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'react-redux': path.resolve('./node_modules/react-redux'),
    }
  }
};
