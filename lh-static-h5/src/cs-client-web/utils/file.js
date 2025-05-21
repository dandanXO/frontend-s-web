import { IMAGE_TYPES, VIDEO_TYPES, AUDIO_TYPES } from "./constants";

function checkMediaType(types, extension) {
  if (!extension) return;
  return types.some((t) => extension.toLowerCase().includes(t));
}

export function isImageFile(extension) {
  return checkMediaType(IMAGE_TYPES, extension);
}

export function isVideoFile(extension) {
  return checkMediaType(VIDEO_TYPES, extension);
}

export function isImageVideoFile(extension) {
  return (
    checkMediaType(IMAGE_TYPES, extension) ||
    checkMediaType(VIDEO_TYPES, extension)
  );
}

export function isAudioFile(extension) {
  return checkMediaType(AUDIO_TYPES, extension);
}

export function convertBase64UrlToImgFile(urlData, fileName, fileType) {
  // 转换为byte
  const bytes = window.atob(urlData);
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Int8Array(ab);

  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  // 转换成文件，添加文件的type，name，lastModifiedDate属性
  const blob = new Blob([ab], { type: fileType });
  blob.lastModifiedDate = new Date();
  blob.name = fileName;

  return blob;
}
