module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        "moduleName": "react-native-dotenv",
        "envName": "APP_ENV",
        "path": ".env",
        "blocklist": null,
        "allowlist": null,
        "safe": true,
        "allowUndefined": true,
        "verbose": false
      },
    ],
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
          "services": "./src/services",
        }
      }
    ],
  ]
};
