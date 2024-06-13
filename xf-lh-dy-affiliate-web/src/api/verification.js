const axios = require('axios')

export const getVerificationImage = async (type = 0) => {
  var url = 'https://sumbtf.tebarncale.com/validator/img/1/200/100';
  if (window.location.pathname.indexOf("dy") > -1 || window.location.pathname.indexOf("xf") > -1 || window.location.pathname.indexOf("lh") > -1) {
    url = 'https://api-gayeway.mpg1cxp9.com/su/validator/img/1/200/100';
    if (type === 1) {
      url = "https://api-gayeway.mpg1cxp9.com/su/validator/img/1/200/100/1"
    }
  } else {
    url = 'https://sumbtf.tebarncale.com/validator/img/1/200/100';
    if (type === 1) {
      url = "https://sumbtf.tebarncale.com/validator/img/1/200/100/1"
    }
  }
  return await axios.get(
    url
  )
}
