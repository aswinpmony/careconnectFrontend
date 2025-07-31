module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // No plugins if you're not using Reanimated v3 worklets
  };
};
