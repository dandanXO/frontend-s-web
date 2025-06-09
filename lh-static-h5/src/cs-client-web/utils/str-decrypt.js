export default async function strDecrypt(params) {
  const CryptoJS = await import("crypto-js");

  const KEY = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
  const IV = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);

  let base64 = CryptoJS.enc.Base64.parse(params);
  let str = CryptoJS.enc.Base64.stringify(base64);
  let decryptedData = CryptoJS.AES.decrypt(str, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return CryptoJS.enc.Utf8.stringify(decryptedData).toString();
}
