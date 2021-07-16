const presets = ['module:metro-react-native-babel-preset'];
const plugins = [];

plugins.push([
  'module-resolver',
  {
    root: ['./src'],
    extensions: ['.js', '.json'],
    alias: {
      '@': './src',
      screens: './src/screens',
      assets: './src/assets',
      json: './src/assets/json',
      models: './src/models',
      components: './src/components',
      services: './src/services',
    },
  },
]);

module.exports = {
  presets,
  plugins,
};
