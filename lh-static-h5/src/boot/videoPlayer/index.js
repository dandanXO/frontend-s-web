/**
 * @typedef {'flv'|'hls'} MediaType
 */

/**
 * @typedef {'FULL'|'NATIVE'|'NONE'} SupportPlayer
 */

import { _flv, initFlv } from "./flv";
import { _hls, initHls } from "./hls";

/**
 * @typedef {Object} VideoPlayerConfig
 * @property {MediaType} mediaType - media source type
 */

/**
 * custom event names
 * @typedef {Object} CustomEvents
 * @type {{ AUTO_PLAY_FAILED: string, STREAM_AVAILABLE: string, STREAM_BUFFERING: string, CUSTOM_ERROR: string, NATIVE_STREAM_BUFFERING: string }}
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
      AUTO_PLAY_FAILED: "CUSTOM_AUTO_PLAY_FAILED",
      STREAM_AVAILABLE: "CUSTOM_STREAM_AVAILABLE",
      STREAM_BUFFERING: "CUSTOM_STREAM_BUFFERING",
      NATIVE_STREAM_BUFFERING: "NATIVE_CUSTOM_STREAM_BUFFERING",
      CUSTOM_ERROR: "CUSTOM_ERROR"
    };
    this._elEvents = {
      EL_WAITING: "waiting",
      EL_LOADSTART: "loadstart",
      EL_STALLED: "stalled",
      EL_SEEKING: "seeking",
      EL_CANPLAY: "canplay",
      EL_PLAYING: "playing",
      EL_LOADEDDATA: "loadeddata",
      EL_LOADEDMETADATA: "loadedmetadata"
    };
    this._eventTarget = new EventTarget();
    this._registeredEvents = [];
    /** @type {SupportPlayer} */
    this.supportPlayer = "NONE";

    return new Proxy(this, {
      get(target, prop, receiver) {
        const originMethod = target[prop];
        if (
          !(prop in target) &&
          typeof target._player === "object" &&
          target._player !== null &&
          prop in target._player
        ) {
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
    if (this._player) this.destroy();

    if (this._mediaType === "hls") {
      this._player = await initHls(this._url, this._config, this.videoEl);
      if (!this._player) {
        this.supportPlayer = "NONE";
        return;
      } else if (_hls.isSupported()) {
        this.qualitySupported = true;
        this.Events = Object.assign({}, _hls.Events, this._customEvents, this._elEvents);
        this.supportPlayer = "FULL";
      } else {
        this.Events = Object.assign({}, _hls.Events, this._customEvents, this._elEvents);
        this.supportPlayer = "NATIVE";
      }
    } else {
      this._player = await initFlv(this._url, this._config);
      if (!this._player) {
        this.supportPlayer = "NONE";
      } else {
        this.supportPlayer = "FULL";
        this.qualitySupported = false;
        this.Events = Object.assign({}, _flv.Events, this._customEvents, this._elEvents);
      }
    }
    this._bindEventsV2();
  }

  async load(startPlay = false) {
    return new Promise(async (resolve, reject) => {
      const timeoutTimer = setTimeout(() => reject("load timeout"), 5 * 1000);
      if (this._mediaType === "hls") {
        if (this.supportPlayer === "FULL") {
          this.on(this.Events.MANIFEST_PARSED, async () => {
            startPlay && (await this.play());
            clearTimeout(timeoutTimer);
            resolve();
          });
          this._player.loadSource(this._url);
          this._player.attachMedia(this.videoEl);
        } else if (this.supportPlayer === "NATIVE") {
          this.on("loadedmetadata", async () => {
            clearTimeout(timeoutTimer);
            startPlay && (await this.play());
            resolve();
          });
          this.videoEl.src = this._url;
        }
      } else {
        this.on(this.Events.SCRIPTDATA_ARRIVED, async () => {
          startPlay && (await this.play());
          clearTimeout(timeoutTimer);
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
      console.error(e);
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
    if (this._mediaType === "hls" && this.supportPlayer === "FULL") {
      latestPosition = this._player.liveSyncPosition;
    } else {
      latestPosition = this.videoEl.buffered.end(0);
    }

    const currentTime = this.videoEl.currentTime;

    if (latestPosition - currentTime > this._maxLatency) {
      this.videoEl.currentTime = latestPosition;
    }
  }

  _bindEvents() {
    if (this._mediaType === "hls") {
      if (this.supportPlayer === "FULL") {
        const hlsVideoResumeEvents = [this.Events.FRAG_BUFFERED, this.Events.FRAG_LOADED];
        this.on(this.Events.ERROR, (event, data) => {
          this._eventTarget.dispatchEvent(new CustomEvent(this._customEvents.CUSTOM_ERROR, { detail: data }));
          // if (data.fatal) {
          //   this._eventTarget.dispatchEvent(new CustomEvent(this._customEvents.CUSTOM_ERROR, { detail: data }));
          // } else {
          //   console.log(data);
          //   this._eventTarget.dispatchEvent(new Event(this._customEvents.STREAM_BUFFERING));
          // }
          // TODO: Do we need more nuanced error handling?
        });
        hlsVideoResumeEvents.forEach((event) => {
          this.on(event, () => {
            this._eventTarget.dispatchEvent(new Event(this._customEvents.STREAM_AVAILABLE));
          });
        });
      } else if (this.supportPlayer === "NATIVE") {
        let isStartup = true;
        this.on("error", () => {
          const error = this.videoEl.error;
          if (!error) return;
          let fetal = false;
          switch (error.code) {
            case MediaError.MEDIA_ERR_DECODE:
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              fetal = true;
              break;
            case MediaError.MEDIA_ERR_ABORTED:
            case MediaError.MEDIA_ERR_NETWORK:
            default:
              fetal = false;
          }
          const customError = {
            type: "NATIVE",
            code: error.code,
            details: error.message,
            message: error.message || "Unknown error",
            fetal
          };
          this._eventTarget.dispatchEvent(new CustomEvent(this._customEvents.CUSTOM_ERROR, { detail: customError }));
          // TODO: Add STREAM_AVAILABLE handling
        });
        this.on("waiting", () => {
          if (isStartup) {
            isStartup = false;
            return;
          }
          this._eventTarget.dispatchEvent(new Event(this._customEvents.NATIVE_STREAM_BUFFERING));
        });
      }
    } else {
      this.on(this.Events.ERROR, (error) => {
        console.error(error);
        const fetalErrors = [
          _flv.ErrorDetails.NETWORK_STATUS_CODE_INVALID,
          _flv.ErrorDetails.NETWORK_UNRECOVERABLE_EARLY_EOF,
          _flv.ErrorDetails.MEDIA_MSE_ERROR,
          _flv.ErrorDetails.MEDIA_ERROR,
          _flv.ErrorDetails.NETWORK_UNSUPPORTED,
          _flv.ErrorDetails.MEDIA_CODEC_UNSUPPORTED
        ];
        const fetal = fetalErrors.includes(error);
        const customError = {
          type: "NATIVE",
          code: error,
          details: error,
          message: error || "Unknown error",
          fetal
        };
        this._eventTarget.dispatchEvent(new CustomEvent(this._customEvents.CUSTOM_ERROR, { detail: customError }));
      });
    }
  }

  _bindEventsV2() {
    const errorEvents = [
      this._elEvents.EL_WAITING,
      this._elEvents.EL_LOADSTART,
      this._elEvents.EL_STALLED,
      this._elEvents.EL_SEEKING
    ];
    const resumeEvents = [this._elEvents.EL_CANPLAY, this._elEvents.EL_LOADEDDATA, this._elEvents.EL_LOADEDMETADATA];
    const VIDEO_PLAY_BUFFER = 10 * 1000; // 10 seconds
    let videoPlayTimer = null;
    let hasStartedPlayback = false;

    const _dispatchError = (event, error) => {
      const customError = {
        type: "NATIVE",
        code: event,
        details: error,
        message: "video element error"
      };
      this._eventTarget.dispatchEvent(new CustomEvent(this._customEvents.CUSTOM_ERROR, { detail: customError }));
    };

    const _dispatchStreamAvailable = (event) => {
      if (videoPlayTimer) {
        clearTimeout(videoPlayTimer);
        videoPlayTimer = null;
      }
      this._eventTarget.dispatchEvent(new Event(this._customEvents.STREAM_AVAILABLE));
    };

    errorEvents.forEach((event) => {
      this.on(event, (e) => {
        if (!hasStartedPlayback) return;
        _dispatchError(event, e);
      });
    });

    resumeEvents.forEach((event) => {
      this.on(event, () => {
        if (event === this._elEvents.EL_PLAYING || event === this._elEvents.EL_CANPLAY) {
          hasStartedPlayback = true;
        }
        _dispatchStreamAvailable(event);
      });
    });

    videoPlayTimer = setTimeout(() => {
      if (hasStartedPlayback) return;
      _dispatchError(this._elEvents.EL_WAITING, {});
    }, VIDEO_PLAY_BUFFER);
  }

  on(event, handler, options) {
    let type;
    if (Object.values(this._customEvents).includes(event)) {
      this._eventTarget.addEventListener(event, handler);
      type = "CUSTOM";
    } else if (Object.values(this._elEvents).includes(event)) {
      this.videoEl.addEventListener(event, handler, options);
      type = "ELEMENT";
    } else {
      type = "PLAYER";
      if (this._mediaType === "hls") {
        if (this.supportPlayer === "FULL") {
          this._player.on(event, handler);
        } else if (this.supportPlayer === "NATIVE") {
          this.videoEl.addEventListener(event, handler, options);
        }
      } else if (this._mediaType === "flv") {
        this._player.on(event, handler);
      }
    }
    this._registeredEvents.push({ type, event, handler });
  }

  off() {
    while (this._registeredEvents.length) {
      const { type, event, handler } = this._registeredEvents.pop();
      if (type === "CUSTOM") {
        this._eventTarget.removeEventListener(event, handler);
      } else if (type === "ELEMENT") {
        this.videoEl.removeEventListener(event, handler);
      } else {
        if (this._mediaType === "hls") {
          if (this.supportPlayer === "FULL") {
            this._player.off(event, handler);
          } else if (this.supportPlayer === "NATIVE") {
            this.videoEl.removeEventListener(event, handler);
          }
        } else {
          this._player.off(event, handler);
        }
      }
    }
  }

  destroy() {
    if (this._mediaType === "hls") {
      if (this.supportPlayer === "FULL") {
        this._player.detachMedia();
        this._player.stopLoad();
        this._player.destroy();
      } else if (this.supportPlayer === "NATIVE") {
        this.videoEl.removeAttribute("src");
        this.videoEl.load();
      }
    } else {
      this._player.unload();
      this._player.detachMediaElement();
      this._player.destroy();
    }
    this.off();
    this._player = null;
  }
}
