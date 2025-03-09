/** @type {typeof import("flv.js").default} */
export let _flv = null;

export const initFlv = async (url, config = {}) => {
  if (!_flv) {
    const flv = await import("flv.js");
    _flv = flv.default;
  }

  if (!_flv.isSupported()) return;

  return _flv.createPlayer(
    {
      type: "flv",
      url: url,
      isLive: true
    },
    config
  );
};
