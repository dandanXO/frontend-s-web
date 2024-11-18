function encryptUrl(url, secretKey) {
  return CryptoJS.AES.encrypt(url, secretKey).toString();
}


