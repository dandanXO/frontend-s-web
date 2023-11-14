import QrcodeImage from './QrcodeImage';
import QRCode from "qrcode";

export const CLICK_INSIDE = 1;
export const CLICK_TOP_BORDER = 2;

export const CLICK_BOTTOM_BORDER = 3;

export const CLICK_RIGHT_BORDER = 4;

export const CLICK_LEFT_BORDER = 5;

export const CLICK_LEFT_TOP_CORNER = 6;

export const CLICK_RIGHT_TOP_CORNER = 7;

export const CLICK_LEFT_BOTTOM_CORNER = 8;

export const CLICK_RIGHT_BOTTOM_CORNER = 9;

// export const CLICK_ALL_BORDER = 6;
export const CLICK_OUTSIDE = 0;

class Poster {
  constructor(canvas, maxWidth, maxHeight) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event, this));
    this.canvas.addEventListener('mousedown', (event) => this.handleMouseDown(event, this));
    this.canvas.addEventListener('mouseup', (event) => this.handleMouseUp(event, this));
    this.elements = [];
    this.pickEle = null
    this.resizeEle = null;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
  }

  handleMouseMove(event, poster) {
    const rect = poster.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.pickEle) {
      this.pickEle.move(mouseX, mouseY);
      this.draw();
      return;
    }
    if (this.resizeEle) {
      this.resizeEle.resize(mouseX, mouseY);
      this.draw();
      return;
    }

    const e = this.elements
      .filter(e => e.isMouseOverRect(mouseX, mouseY))
      .sort((a, b) => a.zIndex - b.zIndex).pop();
    if (e) {
      const type = e.isMouseOverRect(mouseX, mouseY);
      if (type === CLICK_INSIDE) {
        poster.canvas.style.cursor = "move";
      } else if (type === CLICK_TOP_BORDER || type === CLICK_BOTTOM_BORDER) {
        poster.canvas.style.cursor = "ns-resize";
      } else if (type === CLICK_LEFT_BORDER || type === CLICK_RIGHT_BORDER) {
        poster.canvas.style.cursor = "ew-resize";
      } else if (type === CLICK_LEFT_TOP_CORNER || type === CLICK_RIGHT_BOTTOM_CORNER) {
        poster.canvas.style.cursor = "nwse-resize";
      } else if (type === CLICK_RIGHT_TOP_CORNER || type === CLICK_LEFT_BOTTOM_CORNER) {
        poster.canvas.style.cursor = "nesw-resize";
      }
    } else {
      poster.canvas.style.cursor = "default";
    }
  }

  handleMouseDown(event, poster) {
    const rect = poster.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    this.elements
      .filter(e => e.isMouseOverRect(mouseX, mouseY))
      .sort((a, b) => a.zIndex - b.zIndex)
      .findLast(e => {
        const type = e.isMouseOverRect(mouseX, mouseY);
        if (type === CLICK_INSIDE) {
          this.pickEle = e;
          e.updateOffset(mouseX, mouseY);
        } else {
          this.resizeEle = e;
          e.startResize(type);
        }
      })
  }

  handleMouseUp(event, poster) {
    poster.canvas.style.cursor = "default";
    this.pickEle = null;
    if (this.resizeEle) {
      this.resizeEle.endResize();
      this.resizeEle = null;
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;

      image.onload = () => {
        resolve(image);
      };

      image.onerror = (error) => {
        reject(error);
      };
    });
  }

  async background(src) {
    this.posterBg = await this.loadImage(src);
    const imageWidth = this.posterBg.width;
    const imageHeight = this.posterBg.height;
    const ratio = parseFloat(imageWidth) / parseFloat(imageHeight);
    this.originWidth = imageWidth;
    this.originHeight = imageHeight;
    this.w = imageWidth;
    this.h = imageWidth;
    if (imageWidth > this.maxWidth) {
      this.w = this.maxWidth;
      this.h = this.maxWidth / ratio;
    }

    if (imageHeight > this.maxHeight) {
      this.w = this.maxHeight * ratio;
      this.h = this.maxHeight;
    }
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx.drawImage(this.posterBg, 0, 0, this.w, this.h);
  }

  async qrcode(qrcodeData, color) {
    const qrDataURL = await QRCode.toDataURL(qrcodeData, { color: color, width: 100 });
    const img = new Image();
    img.src = qrDataURL;
    img.crossOrigin = "";
    img.onload = () => {
      const qrcode = this.elements.filter(e => e.getType() === "qrcode").pop();
      if (qrcode) {
        qrcode.replaceImage(img);
      } else {
        this.elements.push(new QrcodeImage(img, 0));
      }
      this.draw();
    };
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.posterBg, 0, 0, this.canvas.width, this.canvas.height);
    this.elements.sort((a, b) => a.zIndex - b.zIndex)
      .forEach(e => {
        e.draw(this.ctx);
      })
  }

  downloadOriginSize() {
    const dataURL = this.canvas.toDataURL('image/jpg');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas_image.png';
    a.click();
  }

  loadElement(elements, resizeX, resizeY) {
    // const ratioX = parseFloat(this.w) / parseFloat(resizeX)
    // const ratioY = parseFloat(this.h) / parseFloat(resizeY)
    this.elements = [...elements]
    this.elements.forEach(e => {

    })
    this.draw();
  }

  async download() {
    const tempCanvas = document.createElement('canvas');
    document.body.appendChild(tempCanvas);
    tempCanvas.style.display = "none";
    const tempPoster = new Poster(tempCanvas, this.originWidth, this.originHeight);
    await tempPoster.background(this.posterBg.src)
    tempPoster.loadElement(this.elements, this.w, this.h);
    tempPoster.downloadOriginSize();
    tempCanvas.parentNode.removeChild(tempCanvas);
  }
}

export default Poster;
