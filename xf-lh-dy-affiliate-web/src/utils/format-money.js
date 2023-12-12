export function formatMoney(number, decimals = 0, decPoint = ".", thousandsSep = ",") {
  number = (number + "").replace(/[^0-9+-Ee.]/g, "");
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = (typeof thousandsSep === "undefined") ? "," : thousandsSep;
  const dec = (typeof decPoint === "undefined") ? "." : decPoint;
  let s = [];
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec);
    return "" + Math.ceil(n * k) / k;
  };
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  const re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}
