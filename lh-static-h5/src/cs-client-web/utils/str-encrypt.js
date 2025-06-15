import CryptoJS from 'crypto-js';

const KEY = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const IV = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);

export default function strEncrypt(params) {
  let str = CryptoJS.enc.Utf8.parse(params);
  let encryptedData = CryptoJS.AES.encrypt(str, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return CryptoJS.enc.Base64.stringify(encryptedData.ciphertext);
}
