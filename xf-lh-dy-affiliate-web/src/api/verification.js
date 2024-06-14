const axios = require('axios')

export const getVerificationImage = async (type = 0) => {
  var url = 'https://sumbtf.tebarncale.com/validator/img/1/200/100';
  if (type === 1) {
    url = "https://sumbtf.tebarncale.com/validator/img/1/200/100/1"
  }

  return await axios.get(
    url
  )
}
