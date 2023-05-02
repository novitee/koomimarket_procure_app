module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "module-resolver", {
        "root": ["./src"],
        "alias": {
          "assets": "./src/assets",
          "screens": "./src/screens",
          "components": "./src/components",
          "utils": "./src/utils",
          "hooks": "./src/hooks",
          "navigations": "./src/navigations",
          "contexts": "./src/contexts",
        }
      }
    ],
  ]
};
