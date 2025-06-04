export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;

  for (let i = str.length - 1; i >= 0; i--) {
    let code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
  }

  return s;
}

export function strToJSON(str) {
  try {
    if (typeof str === "string" || str instanceof String) {
      return JSON.parse(str);
    }

    return str;
  } catch (e) {
    console.log(`String to Json error: ${e}`);
    return null;
  }
}

export function uid(length = 16) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default {
  byteLength,
  strToJSON,
  uid,
};
