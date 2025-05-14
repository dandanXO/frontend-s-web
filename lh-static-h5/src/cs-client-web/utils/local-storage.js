/* eslint-disable */
import { LocalStorage as ls } from "quasar";
import isNull from "lodash/isNull";
import { useUserStore } from "src/cs-client-web/stores/user";
import { useChatStore } from "src/cs-client-web/stores/chat";

const LocalStorage = {
  isStorageEnabled() {
    const userStore = useUserStore();
    if (!userStore.is_storage_enabled) {
      return false;
    }
    return true;
  },
  getKeyName(key) {
    const chatStore = useChatStore();
    if (!this.isStorageEnabled()) {
      const userStore = useUserStore();
      var momory_pre = userStore.memory_prefix;
      return momory_pre + key;
    }

    const prefix = chatStore.prefixId;

    if (prefix !== null) {
      return prefix + key;
    }

    return "";
  },
  set(keyName, keyValue, ttl = 0) {
    // console.log("SET: " + keyName);
    if (!this.isStorageEnabled()) {
      // alert("NO STORAGE");
      this.setMemory(keyName, keyValue);
      return;
    }

    const data = {
      value: keyValue // store the value within this object
    };

    data.ttl = ttl;

    if (ttl > 0) {
      data.ttl = Date.now() + ttl * 1000; // store the TTL (time to live)
    }

    // debugger;
    // store data in LocalStorage
    // console.log("SEt With Name: " + this.getKeyName(keyName));
    ls.set(this.getKeyName(keyName), data);
  },
  setMemory(keyName, keyValue) {
    const userStore = useUserStore();
    var local_memory = userStore.local_memory;

    // console.log("SEt Data");
    // console.log(keyValue);

    local_memory[this.getKeyName(keyName)] = keyValue;
    userStore.local_memory = local_memory;

    return true;
  },
  get(keyName, defaultValue = null) {
    // console.log("GET: " + keyName);
    if (!this.isStorageEnabled()) {
      // alert("NO STORAGE");
      // console.log("Memory")
      var memory_data = this.getMemory(keyName);
      return memory_data;
    }

    const data = ls.getItem(this.getKeyName(keyName));
    // console.log("Get data");
    // console.log(data);

    if (data === null || data.value === null) {
      // if no value exists associated with the key, return null
      return defaultValue;
    }

    // If TTL has expired, remove the item from localStorage and return null
    if (data.ttl > 0 && Date.now() > data.ttl) {
      ls.remove(this.getKeyName(keyName));
      return null;
    }

    // return data if not expired
    return data.value;
  },
  getMemory(keyName) {
    const userStore = useUserStore();
    var local_memory = userStore.local_memory;

    var foundData = "";
    for (var key in local_memory) {
      // console.log("GET: " + key);
      // console.log(local_memory[key]);
      if (key == this.getKeyName(keyName) && local_memory[key] !== undefined) {
        foundData = local_memory[key];
        break;
      }
    }
    return foundData;
  },
  pull(keyName, defaultValue = null) {
    if (!this.isStorageEnabled()) {
      // alert("NO STORAGE");
      // console.log("Pull Memory")
      var memory_data = this.getMemory(keyName);
      return memory_data;
    }

    let data = this.get(keyName, defaultValue);
    // console.log("Pull Data:" + data);

    ls.remove(this.getKeyName(keyName));

    return data;
  },
  getItem(keyName, defaultValue = null) {
    if (!this.isStorageEnabled()) {
      // alert("NO STORAGE");
      // console.log("Get Item")
      var memory_data = this.getMemory(keyName);
      return JSON.stringify(memory_data);
    }

    return this.get(this.getKeyName(keyName), defaultValue);
  },
  has(keyName) {
    if (!this.isStorageEnabled()) {
      const userStore = useUserStore();
      var local_memory = userStore.local_memory;

      var hasFound = false;
      for (var key in local_memory) {
        // console.log("GET: " + key);
        // console.log(local_memory[key]);
        if (key == this.getKeyName(keyName) && local_memory[key] !== undefined) {
          hasFound = true;
          break;
        }
      }
      return hasFound;
    }

    let data = this.get(this.getKeyName(keyName));

    return !isNull(data);
  },
  findPrefixByChatUid(chatUid) {
    var thePrefixKey = "";
    var keys = ls.getAllKeys();
    for (var key in keys) {
      var keyName = keys[key];
      if (keyName.indexOf("chatGuid") > -1) {
        // console.log(keyName);
        var item = ls.getItem(keyName);
        // console.log(item);
        if (item && item.value === chatUid) {
          thePrefixKey = keyName.replaceAll("chatGuid", "");
          break;
        }
      }
    }
    // console.log("Found Prefix: " + thePrefixKey);
    return thePrefixKey;
  },
  remove(keyName) {
    if (!this.isStorageEnabled()) {
      const userStore = useUserStore();
      userStore.local_memory[keyName] = undefined;
      return;
    }

    ls.remove(this.getKeyName(keyName));
  },
  clearPrefix() {
    const chatStore = useChatStore();
    var prefix = chatStore.prefixId;
    var keys = ls.getAllKeys();
    for (var key in keys) {
      var keyName = keys[key];
      if (typeof keyName === "string" && keyName.substring(0, prefix.length) === prefix) {
        // console.log(keyName);
        ls.remove(keyName);
      }
    }
  },
  clear() {
    if (!this.isStorageEnabled()) {
      const userStore = useUserStore();
      userStore.local_memory = {};
      return;
    }

    ls.clear();
  }
};

export default LocalStorage;
