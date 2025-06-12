import fileApi from "src/cs-client-web/api/fileApi";

const CDN_URL = process.env.CDN_URL;

export default function uploadFile(fileName, file, progressCallback) {
  return new Promise((resolve, reject) => {
    fileApi.upload(file, progressCallback).then((res) => {
      // 文件上传失败
      if (res.code !== 0) {
        reject({ msg: "System exception", code: -1 });
      } else {
        let path = res.data[0];
        let fileLast = path.split("/").slice(-1)[0];
        let fileUrl = `${CDN_URL}/${path}`;

        resolve({
          name: fileName,
          url: fileUrl,
          extension: fileLast.split(".")[1],
          type: fileLast.split(".")[1]
        });
      }
    });
  });
}
