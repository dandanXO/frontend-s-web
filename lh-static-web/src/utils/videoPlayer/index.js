/**
 * @typedef {'flv'|'hls'} MediaType
 */

import { initFlv } from "./flv";
import { _hls, initHls } from "./hls";

/**
 * @typedef {Object} VideoPlayerConfig
 * @property {MediaType} mediaType - media source type
 */

export class VideoPlayer {
  /**
   * @param {VideoPlayerConfig} config - video element
   * @param {HTMLVideoElement} video - video element
   */
  constructor(config, video) {
    const { mediaType, url, ...otherConfig } = config;
    this.videoEl = video;
    this._mediaType = mediaType;
    this._config = otherConfig;
    this._player = null;
    this._url = url;
    this.qualitySupported = false;
    /** @type { typeof import('hls.js').Events | import('flv.js').default.Events} */
    this.Events = {};

    return new Proxy(this, {
      get(target, prop, receiver) {
        const originMethod = target[prop];
        if (!(prop in target) && target._player && prop in target._player) {
          return target._player[prop];
        }
        if (typeof originMethod !== "function" || ["checkInitialization", "destroy", "init"].includes(prop)) {
          return originMethod;
        }
        return async function (...args) {
          target.checkInitialization();
          return await originMethod.apply(this, args);
        };
      }
    });
  }

  async init() {
    if (this._mediaType === "hls") {
      this._player = await initHls(this._url, this._config, this.videoEl);
      this.qualitySupported = true;
      this.Events = _hls.Events;
    } else {
      this._player = await initFlv(this._url, this._config);
      this.qualitySupported = false;
      this.Events = this._player.Events;
    }
  }

  async load(startPlay = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Media source load Timeout"));
      }, 5000);

      if (this._mediaType === "hls") {
        this._player.on(this.Events.MANIFEST_PARSED, () => {
          startPlay && this.play();
          resolve();
        });
        this._player.loadSource(this._url);
        this._player.attachMedia(this.videoEl);
      } else {
        this._player.on(this.Events.LOADING_COMPLETE, () => {
          startPlay && this.play();
          resolve();
        });
        this._player.attachMediaElement(this.videoEl);
        this._player.load();
      }
    });
  }

  play() {
    if (this._mediaType === "hls") {
      this.videoEl.play();
    } else {
      this._player.play();
    }
  }

  pause() {
    if (this._mediaType === "hls") {
      this.videoEl.pause();
    } else {
      this._player.pause();
    }
  }

  setConfig(config) {}

  checkInitialization() {
    if (!this._player) {
      throw new Error("Player not initialized");
    }
  }

  setQualityLevel(level) {
    if (!this.qualitySupported) return;
    if (this._mediaType === "hls") {
      this._player.currentLevel = level;
      this._player.stopLoad();
      this._player.startLoad(this.videoEl.currentTime);
    }
  }

  destroy() {}
}
