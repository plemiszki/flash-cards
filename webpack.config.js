module.exports = {
  context: __dirname,
  entry: './redux/entry.jsx',
  output: {
    path: './app/assets/javascripts',
    filename: 'bundle.js',
    // devtoolModuleFilenameTemplate: '[resourcePath]',
    // devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015-without-strict']
        }
      }
    ]
  },
  // devtool: 'source-maps',
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
