export const isValidUsername = (str) => ["admin", "editor"].indexOf(str.trim()) >= 0;

export const isExternal = (path) => /^(https?:|mailto:|tel:)/.test(path);

export const isArray = (arg) => {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg);
};

export const isValidURL = (url) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
};

export const isValidDomainURL = (url) => {
  const reg = /^([\w\d]+\.com)*$/;
  return reg.test(url);
};

export const required = (msg) => {
  return {
    required: true,
    message: msg,
    trigger: "blur"
  };
};

export const size = (min, max, msg) => {
  return {
    min: min,
    max: max,
    message: msg,
    trigger: "blur"
  };
};

export const digital = (msg) => {
  return {
    type: "number",
    message: msg,
    trigger: "blur"
  };
};

export const isNumeric = (msg) => {
  return {
    required: true,
    pattern: /^0*[1-9]\d*(\.\d{1,4})?$/,
    message: msg,
    trigger: 'blur'
  }
};

export const email = (msg) => {
  return {
    type: "email",
    message: msg,
    trigger: "blur"
  };
};

export const isAlphaNumeric = (val) => {
  const reg = /^[a-zA-Z0-9_]*$/;
  return reg.test(val);
}

export const isAlphaNumericUnderscore = (val) => {
  const reg = /^[a-zA-Z0-9_]*$/;
  return reg.test(val);
}

export const numericOnly = (msg) => {
  return {
    required: true,
    pattern: /^[0-9]*$/,
    message: msg,
    trigger: 'blur'
  }
}

export const checkJson = (rule, value, callback) => {
  try {
    JSON.parse(value);
  } catch (e) {
    callback(new Error('Please enter value in JSON format.'));
  }
  callback();
}

export const isNumericNonRequired = (val) => {
  const reg = /^0*[1-9]\d*(\.\d{1,4})?$/;
  return reg.test(val);
};

export const numericOnlyNonRequired = (val) => {
  const reg = /^[0-9]*$/;
  return reg.test(val);
};
