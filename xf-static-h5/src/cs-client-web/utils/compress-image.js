export default function compressImage(base64, scale, callback) {
  const _img = new Image();
  _img.src = base64;
  _img.onload = () => {
    const _canvas = document.createElement("canvas");
    const w = _img.width / scale;
    const h = _img.height / scale;

    _canvas.setAttribute("width", w + "");
    _canvas.setAttribute("height", h + "");
    _canvas.getContext("2d")?.drawImage(_img, 0, 0, w, h);

    const base64 = _canvas.toDataURL("image/jpeg");
    // 当canvas对象的原型中没有toBlob方法的时候，手动添加该方法
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value: function (callback, type, quality) {
          const binStr = atob(this.toDataURL(type, quality).split(",")[1]),
            len = binStr.length,
            arr = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }
          callback(new Blob([arr], { type: type || "image/png" }));
        },
      });
    } else {
      _canvas.toBlob((blob) => {
        if (blob && blob.size > 1024 * 1024) {
          compressImage(base64, scale, callback);
        } else {
          callback(blob, base64);
        }
      }, "image/jpeg");
    }
  };
}
