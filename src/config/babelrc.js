module.exports = {
  presets: [
    [
      require('babel-preset-env'),
      {
        targets: {
          browsers: ['last 2 versions', 'ie 11'],
        },
      },
    ],
    require('babel-preset-react'),
    require('babel-preset-stage-0'),
  ],
  plugins: [],
}
