import router from '../router';
const axios = require('axios');
export const getVerificationImage = async (type = 0, isClick = 1) => {
  var url = '';
  if (window.location.pathname.indexOf("dy") > -1 || window.location.pathname.indexOf("xf") > -1 || window.location.pathname.indexOf("lh") > -1) {
    url = 'https://api-gateway.scnf3jntnc5.com/su/validator/img/1/200/100';
    if (type === 1) {
      url = "https://api-gateway.scnf3jntnc5.com/su/validator/img/1/200/100/1"
    }
    if (isClick === 0) {
      // slider
      url = "https://api-gateway.scnf3jntnc5.com/su/validator/img/0/200/100"
    }
  } else {
    url = 'https://sumbtf.tebarncale.com/validator/img/1/200/100';
    if (type === 1) {
      url = "https://sumbtf.tebarncale.com/validator/img/1/200/100/1"
    }
    if (isClick === 0) {
      // slider
      url = "https://sumbtf.tebarncale.com/validator/img/0/200/100"
    }
  }
  // return await axios.get(
  //   url
  // )
  try {
    const response = await axios.get(url);
    if (response && response.data) {
      if (response.data.code === 4030000) {
        router.push('/403');
      }
      return response;
    }
  } catch (error) {
    console.log(error)
  }
}
