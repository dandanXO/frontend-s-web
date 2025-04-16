/* eslint-disable */

module.exports = (api) => {
  return {
    presets: [
      [
        '@quasar/babel-preset-app',
        api.caller((caller) => caller && caller.target === 'node')
          ? { targets: { node: 'current' } }
          : {}
      ],
      [
        '@babel/preset-env',
        {
          targets: {
            chrome: '50',
            android: '6',
            ios: '10',
            safari: '10',
            ie: '11'
          },
          useBuiltIns: 'entry',
          corejs: 3
        }
      ]
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator'
    ]
  };
};
