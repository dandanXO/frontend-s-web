/* eslint-disable */
import {LocalStorage as ls} from "quasar";
import {isNull} from "lodash";

const LocalStorage = {
    set(keyName, keyValue, ttl = 0) {
        // console.log("SET: " + keyName);
        const data = {
            value: keyValue,// store the value within this object
        }

        data.ttl = ttl;

        if (ttl > 0) {
            data.ttl = Date.now() + (ttl * 1000); // store the TTL (time to live)
        }

        // debugger;
        // store data in LocalStorage
        // console.log("SEt With Name: " + this.getKeyName(keyName));
        ls.set(keyName, data);
    },
    get(keyName, defaultValue = null) {

        const data = ls.getItem(keyName);
        // console.log("Get data");
        // console.log(data);

        if (data === null || data.value === null) {     // if no value exists associated with the key, return null
            return defaultValue;
        }

        // If TTL has expired, remove the item from localStorage and return null
        if (data.ttl > 0 && Date.now() > data.ttl) {
            ls.remove(keyName);
            return null;
        }

        // return data if not expired
        return data.value;
    },
    pull(keyName, defaultValue = null) {
        let data = this.get(keyName, defaultValue);
        // console.log("Pull Data:" + data);

        ls.remove(keyName);

        return data;
    },
    getItem(keyName, defaultValue = null) {


        return this.get(keyName, defaultValue);
    },
    has(keyName) {
        let data = this.get(keyName);

        return !isNull(data);
    },
    remove(keyName) {
        ls.remove(keyName);
    },
    clear() {
        ls.clear();
    }
}

export default LocalStorage;
