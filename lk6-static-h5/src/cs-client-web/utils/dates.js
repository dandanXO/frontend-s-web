import moment from "moment";

export const parseTimestamp = (timestamp) => {
  let datetime = moment(timestamp);
  let today = moment().startOf("day");
  let yesterday = today.clone().day(-1);
  let week = today.clone().day(-7);

  let date = datetime.format("ll");

  if (datetime.isSame(today, "day")) {
    date = "今天";
  } else if (datetime.isSame(yesterday, "day")) {
    date = "昨天";
  } else if (datetime.isAfter(week)) {
    date = datetime.format("dddd, Do");
  }

  return date;
};
