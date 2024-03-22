/* eslint-disable */

module.exports = api => {
  return {
    presets: [
      [
        '@quasar/babel-preset-app',
        api.caller(caller => caller && caller.target === 'node')
          ? { targets: { node: 'current' } }
          : {}
      ],
      [
        "@babel/preset-env",
        {
          targets: {
            android: "7.0",
            browsers: ["last 10 versions", "ie >= 9"]
          }
        }
      ]
    ]
  }
}
