module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        envName: 'APP_ENV',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: true,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          assets: './src/assets',
          components: './src/components',
          containers: './src/containers',
          configs: './src/configs',
          libs: './src/libs',
          hooks: './src/hooks',
          navigations: './src/navigations',
          screens: './src/screens',
          utils: './src/utils',
          stores: './src/stores',
        },
      },
    ],
    'nativewind/babel',
  ],
};
