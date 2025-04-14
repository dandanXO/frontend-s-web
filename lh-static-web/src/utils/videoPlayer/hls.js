/** @type {typeof import("hls.js").default} */
export let _hls = null;

/**
 * @param {String} url
 * @param {Object} config
 * @param {HTMLVideoElement} videoEl
 * @returns
 */

export const initHls = async (url, config = {}, videoEl) => {
  if (!_hls) {
    const hls = await import("hls.js");
    _hls = hls.default;
  }

  if (_hls.isSupported()) {
    return new _hls(config);
  } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
    videoEl.src = url;
    return true;
  } else {
    return;
  }
};
