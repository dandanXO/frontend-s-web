export const MAIN = "MAIN";

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
export const getMobileOS = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return "ANDROID";
  } else if (/iPad|iPhone|iPod/.test(ua)) {
    return "IOS";
  }
  return null;
};
export const getDevice = () => {
  return isMobile() ? "MOBILE" : "WEB";
};

export const displayBalance = (balance) => {

  let numberStr = balance.toString();

  // Initialize an empty string to store the formatted number
  let formattedNumber = '';

  // Iterate through the string in reverse order
  for (let i = numberStr.length - 1, j = 0; i >= 0; i--, j++) {
    // Append the character to the formatted number string
    formattedNumber = numberStr[i] + formattedNumber;

    // Add a comma after every third digit, except for the last digit
    if ((j + 1) % 3 === 0 && j !== numberStr.length - 1) {
      formattedNumber = ',' + formattedNumber;
    }
  }

  return formattedNumber;
};

export function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

export const lsGet = (key, jsonParse = false) => {
  const value = localStorage.getItem(key) ?? '';

  return value && jsonParse ? JSON.parse(value) : value;
}

export const lsStore = (key, value, jsonStringfy = false) => {
  const n_value = jsonStringfy ? JSON.stringify(value) : value;

  localStorage.setItem(key, n_value);
}

export const lsRemove = key => localStorage.removeItem(key)

export const getTimeout = key => {
  const cached_timeout = lsGet(key) ?? 0
  const now = new Date()

  return cached_timeout > now.getTime() 
    ? Math.ceil((cached_timeout - now.getTime()) / 1000) // Seconds left
    : 0  // No timeout found
}

export const getImageUrl = srcPath => require(`/src/assets/${srcPath}`)
