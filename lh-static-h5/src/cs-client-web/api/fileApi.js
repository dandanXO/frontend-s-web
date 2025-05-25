import { api } from "src/boot/axios";

const BASE_URL = process.env.UPLOAD_URL;

/* eslint-disable */
const fileApi = {
  upload(selectedFile, onUploadProgress) {
    let formData = new FormData();
    formData.append("files", selectedFile, selectedFile.name);
    //formData.append("dir", "file");
    //formData.append("overwrite", "true");
    formData.append("_qs", false);

    return api({
      method: "post",
      baseURL: BASE_URL,
      url: "/upload/file",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      onUploadProgress:
        onUploadProgress ??
        function (event) {
          const percentage = Math.round((100 * event.loaded) / event.total);
          // console.log(`file progress ->> ${percentage}%`);
        },
    });
  },
};

export default fileApi;
