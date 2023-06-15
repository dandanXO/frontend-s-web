export const TIME_EXPIRED = "TIME_EXPIRED";
export const GOT_EXPIRED = "GOT_EXPIRED";
const DEFAULT_EXPIRED_TIME = 60;

function getStorageData(key) {
  const s_data = sessionStorage.getItem(key);
  return s_data == undefined || s_data == null ? null : JSON.parse(s_data);
}

function setStorageData(key, value) {
  value = JSON.stringify(value);
  sessionStorage.setItem(key, value);
}

function removeStorageData(key) {
  sessionStorage.removeItem(key);
}

class CachedNode {
  constructor(key, value, expired_type, expired_value) {
    this.key = key;
    this.value = value;
    this.expired_type = expired_type;
    this.expired_value = expired_value;
    this.gotTimes = 1;
    this.expired_time = new Date().getTime() + this.expired_value * 1000;
  }
}

class Cached {
  get(
    key,
    fn,
    { expired_type = TIME_EXPIRED, expired_value = DEFAULT_EXPIRED_TIME } = {}
  ) {
    let value = this.getAndCheck(key);
    if (value) {
      return Promise.resolve(value);
    } else {
      if (fn) {
        return fn().then((d) => {
          let node = new CachedNode(key, d.data, expired_type, expired_value);
          setStorageData(key, node);
          return d.data;
        });
      }
    }
  }

  getAndCheck(key) {
    try {
      let node = getStorageData(key);
      if (node) {
        if (this.isExpired(node)) {
          setStorageData(key, node);
          return node.value;
        } else {
          removeStorageData(key);
          return null;
        }
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  isExpired(node) {
    node.gotTimes++;
    if (
      node.expired_type === TIME_EXPIRED &&
      this.currentTime() <= node.expired_time
    ) {
      return true;
    } else if (
      node.expired_type === GOT_EXPIRED &&
      node.gotTimes <= node.expired_value
    ) {
      return true;
    } else {
      return false;
    }
  }

  currentTime() {
    return new Date().getTime();
  }
}

let cached = new Cached();
export default cached;
