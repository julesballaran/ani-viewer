module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            screens: "./screens",
            utils: "./utils",
            navigation: "./navigation",
            components: "./components",
            store: "./store",
          },
        },
      ],
    ],
  }
}
