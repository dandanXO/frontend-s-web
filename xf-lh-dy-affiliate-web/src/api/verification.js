const axios = require('axios')

export const getVerificationImage = async siteCode => {
  return await axios.get(
    `https://url-shortener.camestible.com/validator/img/1/${siteCode}/200/100`
    // 'http://192.168.79.11:8091/validator/img/1/2/400/200/0/0'
  )
}
