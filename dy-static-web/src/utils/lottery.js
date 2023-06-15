import * as _ from "lodash";
import moment from "moment";

//Change Array Number to String (Without ','
export const arrToStr = (arr) => {
  return arr.toString().replaceAll(",", "");
};

export const arrToStrOrSlash = (arr) => {
  if (arr.length === 0) {
    return "-";
  }
  return arr.toString().replaceAll(",", "");
};

//Convert Num String to Decimal 2 Float.
export const strToFloat = (str) => {
  return parseFloat(str).toFixed(2);
};

//Convert Num String to Decimal 2 Float.
export const strToDec3 = (str) => {
  return parseFloat(str).toFixed(3);
};

export const strToDisplayMoney = (str) => {
  // let newStrArray = _.round(str, 3);
  let newStrArray = _.round(str, 2);
  return newStrArray;
  // parseFloat(str).toFixed(3).split(".");
  // if(newStrArray.length === 0 ){
  //   return newStrArray[0];
  // } if (newStrArray.length > 1) {
  //
  //
  // }
  //
  // return newStrArray[0] + lastStr;
};

export const toFixedWithoutZeros = (num) => {
  let precision = 3;
  num.toFixed(precision).replace(/\.0+$/, "");
};

//Get A Random Number.
export const randNum = () => {
  return Math.floor(Math.random() * 99999);
};

//Change a Num String to Array.
export const strToNumArr = (num_str) => {
  var array = [];
  for (var i = 0; i < num_str.length; i++) {
    array.push(parseInt(num_str[i]));
  }
  return array;
};

export const randomNumArray = () => {
  var num1 = Math.floor(Math.random() * 10);
  var num2 = Math.floor(Math.random() * 10);
  var num3 = Math.floor(Math.random() * 10);
  var num4 = Math.floor(Math.random() * 10);
  var num5 = Math.floor(Math.random() * 10);

  return [num1, num2, num3, num4, num5];
};

export const getTimeInterval = (startTime, endTime) => {
  var start = moment(startTime, "");
  var end = moment(endTime, "");
  var seconds = end.diff(start, "seconds");
  return seconds;
};

//
export const removeDuplicates = (arr) => {
  return arr.filter((item,
                     index) => arr.indexOf(item) === index);
};

//Check if CodeId of Lottery Game exists in Array.
export const hasGameType = (code, arrayLists) => {
  let findIndex = _.findIndex(arrayLists, function(o) {
    return o.code == code;
  });
  return (findIndex > -1);
};

// Get Chinese String of Bet Unit (元角分厘)
export const getBetUnitStr = (type) => {
  if (type === "1") {
    return "元";
  } else if (type === "0.1") {
    return "角";
  }
  // else if (type === "0.01") {
  //   return "分";
  // } else if (type === "0.001") {
  //   return "厘";
  // }
};

export const getBetUnitId = (type) => {
  if (type === "1") {
    return "DOLLAR";
  } else if (type === "0.1") {
    return "TEN_CENT";
  }
};

export const generateDisplayRow = (row) => {
  var array = [];

  if (row.includes("B")) {
    array.push("大");
  }
  if (row.includes("S")) {
    array.push("小");
  }
  if (row.includes("O")) {
    array.push("单");
  }
  if (row.includes("E")) {
    array.push("双");
  }

  return array;
};

export const getPlayStyleModeStr = (mode, style) => {
  var mode_str = "";
  var type_str = "";
  //Get Mode Str.
  if (mode == "FIVE_STAR") {
    mode_str = "五星";
  } else if (mode == "BIG_SMALL_ODD_EVEN") {
    mode_str = "大小单双";
  }

  //Get Play Style Str.
  if (style == "FiveStar_DS") {
    type_str = "单式";
  } else if (style == "FiveStar_FS") {
    type_str = "复式";
  } else if (style == "FiveStar_ZX120") {
    type_str = "组选120";
  } else if (style == "FiveStar_ZX60") {
    type_str = "组选60";
  } else if (style == "FiveStar_ZX30") {
    type_str = "组选30";
  } else if (style == "FiveStar_ZX20") {
    type_str = "组选20";
  } else if (style == "FiveStar_ZX10") {
    type_str = "组选10";
  } else if (style == "FiveStar_ZX5") {
    type_str = "组选5";
  } else if (style == "FiveStar_YFFS") {
    type_str = "一帆风顺";
  } else if (style == "FiveStar_HSCS") {
    type_str = "好事成双";
  } else if (style == "FiveStar_SXBX") {
    type_str = "三星报喜";
  } else if (style == "FiveStar_SJFC") {
    type_str = "四季发财";
  }


  if (style && mode) {
    return mode_str + "_" + type_str;
  } else if (mode) {
    return mode_str;
  } else if (style) {
    return type_str;
  } else {
    return "???";
  }

};


