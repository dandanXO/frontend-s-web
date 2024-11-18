function encryptUrl(url, secretKey) {
  const encryptedUrl = CryptoJS.AES.encrypt(url, secretKey).toString();
  return encryptedUrl;
}


