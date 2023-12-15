import moment from "moment";

export function formatTimeZone(time, timezone) {
  if (!timezone) {
    return moment(time).format('YYYY/MM/DD HH:mm:ss');
  }

  var oriTimeZone = moment(time).subtract(8, 'hour');
  var hourDifferent = timezone.substring(1);

  var formattedTimeZone = timezone.charAt(0) === '+'
    ? moment(oriTimeZone).add(hourDifferent, 'hours')
    : moment(oriTimeZone).subtract(hourDifferent, 'hours');

  return moment(formattedTimeZone).format('YYYY/MM/DD HH:mm:ss');
}
