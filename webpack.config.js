module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./build/webpack.prod.config')
    : require('./build/webpack.dev.config')
