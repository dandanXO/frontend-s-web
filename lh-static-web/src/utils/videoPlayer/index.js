/**
 * @typedef {'flv'|'hls'} MediaType
 */

/**
 * @typedef {'FULL'|'ORIGIN'|'NONE'} SupportPlayer
 */

import { initFlv } from "./flv";
import { _hls, initHls } from "./hls";

/**
 * @typedef {Object} VideoPlayerConfig
 * @property {MediaType} mediaType - media source type
 */

/**
 * custom event names
 * @typedef {Object} CustomEvents
 * @type {{ AUTO_PLAY_FAILED: string }}
 */

export class VideoPlayer {
  /**
   * @param {VideoPlayerConfig} config - video element
   * @param {HTMLVideoElement} video - video element
   */
  constructor(config, video) {
    const { mediaType, url, maxLiveLatency, ...otherConfig } = config;
    this.videoEl = video;
    this._mediaType = mediaType;
    this._config = otherConfig;
    this._player = null;
    this._url = url;
    this.qualitySupported = false;
    this._maxLatency = maxLiveLatency || 10;
    /** @type { typeof import('hls.js').Events | import('flv.js').default.Events | CustomEvents} */
    this.Events = {};
    this._customEvents = {
      AUTO_PLAY_FAILED: "AUTO_PLAY_FAILED"
    };
    this._eventTarget = new EventTarget();
    /** @type {SupportPlayer} */
    this.SupportPlayer = "NONE";

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
      if (!this._player) {
        this.SupportPlayer = "NONE";
        return;
      } else if (_hls.isSupported()) {
        this.qualitySupported = true;
        this.Events = Object.assign({}, this._customEvents, _hls.Events);
        this.SupportPlayer = "FULL";
      } else {
        this.SupportPlayer = "ORIGIN";
      }
    } else {
      this._player = await initFlv(this._url, this._config);
      if (!this._player) {
        this.SupportPlayer = "NONE";
      } else {
        this.qualitySupported = false;
        this.Events = Object.assign({}, this._customEvents, this._player.Events);
      }
    }
  }

  async load(startPlay = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Media source load Timeout"));
      }, 5000);

      if (this._mediaType === "hls") {
        this._player.on(this.Events.MANIFEST_PARSED, async () => {
          startPlay && (await this.play());
          resolve();
        });
        this._player.loadSource(this._url);
        this._player.attachMedia(this.videoEl);
      } else {
        this._player.on(this.Events.LOADING_COMPLETE, async () => {
          startPlay && (await this.play());
          resolve();
        });
        this._player.attachMediaElement(this.videoEl);
        this._player.load();
      }
    });
  }

  async play() {
    try {
      if (this._mediaType === "hls") {
        await this.videoEl.play();
      } else {
        await this._player.play();
      }
    } catch (e) {
      this._eventTarget.dispatchEvent(new Event(this._customEvents.AUTO_PLAY_FAILED));
    }
  }

  pause() {
    if (this._mediaType === "hls") {
      this.videoEl.pause();
    } else {
      this._player.pause();
    }
  }

  checkInitialization() {
    if (!this._player) {
      throw new Error("Player not initialized");
    }
  }

  setQualityLevel(level) {
    if (!this.qualitySupported) return;
    if (this._mediaType === "hls") {
      this._player.currentLevel = level;
    }
  }

  changeSource(url) {
    if (this._player) {
      this.destroy();
    }
    this._url = url;
  }

  syncLive() {
    let latestPosition;
    if (this._mediaType === "hls") {
      latestPosition = this._player.liveSyncPosition;
    } else {
      latestPosition = this.videoEl.buffered.end(0);
    }

    const currentTime = this.videoEl.currentTime;

    if (latestPosition - currentTime > this._maxLatency) {
      this.videoEl.currentTime = latestPosition;
    }
  }

  on(event, handler) {
    if (Object.keys(this._customEvents).includes(event)) {
      this._eventTarget.addEventListener(event, handler);
    } else {
      this._player.on(event, handler);
    }
  }

  destroy() {
    if (this._mediaType === "hls") {
      this._player.detachMedia();
      this._player.stopLoad();
      this._player.destroy();
    } else {
      this._player.unload();
      this._player.detachMediaElement();
      this._player.destroy();
    }
    this._player = null;
  }
}
