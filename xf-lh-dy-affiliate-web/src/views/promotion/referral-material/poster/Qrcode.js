import Element from "./Element";
import QRCode from "qrcode";
import { loadImage, MousePosition, ResizeType } from './canvasUtil';

class QrcodeElement extends Element {
  constructor(w = 0, h = 0, zIndex = 0, canvas) {
    super(0, 0, w, h, canvas.width, canvas.height, zIndex)
  }

  async generateQrcode(qrcodeData, color, radius, margin) {
    this.qrcodeData = qrcodeData;
    this.color = color;
    // this.radius = radius;
    this.radius = Math.min(radius, Math.min(this.w, this.h) / 2);
    this.margin = margin;
    const qrDataURL = await this.qrcodeDateURL();
    this.image = await loadImage(qrDataURL);
    this.w = this.image.width;
    this.h = this.image.height;
  }

  changeColor(ctx, color) {
    const rgba = this.hexToRGBA(color);
    const imageData = ctx.getImageData(this.x, this.y, this.w, this.h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = rgba.r;
      data[i + 1] = rgba.g;
      data[i + 2] = rgba.b;
      data[i + 3] = Math.round(rgba.a * 255);
    }
    ctx.putImageData(imageData, this.x, this.y);
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x + this.radius, this.y);
    ctx.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h, this.radius);
    ctx.arcTo(this.x + this.w, this.y + this.h, this.x, this.y + this.h, this.radius);
    ctx.arcTo(this.x, this.y + this.h, this.x, this.y, this.radius);
    ctx.arcTo(this.x, this.y, this.x + this.w, this.y, this.radius);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    ctx.restore();
  }

  getType() {
    return "qrcode";
  }

  getResizeType() {
    return ResizeType.FOUR_CORNER
  }

  async endResize() {
    super.endResize();
    const qrDataURL = await this.qrcodeDateURL();
    this.image = await loadImage(qrDataURL);
  }

  async qrcodeDateURL() {
    return await QRCode.toDataURL(this.qrcodeData, {
      color: this.color,
      width: this.w,
      height: this.h,
      margin: this.margin
    });
  }

  async recovery(ratioX, ratioY) {
    super.recovery(ratioX, ratioY)
    const qrDataURL = await this.qrcodeDateURL();
    this.image = await loadImage(qrDataURL);
  }

  resize(mouseX, mouseY) {
    let dx = 0;
    let dy = 0;
    let delta = 0;
    switch (this.resizeType) {
      case MousePosition.CLICK_LEFT_TOP_CORNER:
        dx = this.x - mouseX;
        dy = this.y - mouseY;

        // Choose the minimum delta to maintain proportional resizing
        delta = Math.min(dx, dy);

        // Resize the rectangle
        this.w += delta;
        this.h += delta;

        // Update the position of the rectangle's top-left corner
        this.x -= delta;
        this.y -= delta;
        break;

      case MousePosition.CLICK_RIGHT_TOP_CORNER:
        dx = mouseX - (this.x + this.w); // Horizontal distance from right-top corner to the mouse
        dy = this.y - mouseY; // Vertical distance from right-top corner to the mouse

        // Choose the minimum delta to maintain proportional resizing
        delta = Math.min(dx, dy);

        // Resize the rectangle
        this.w += delta; // Add delta to width to maintain proportion
        this.h += delta; // Add delta to height to maintain proportion

        // Update the position of the rectangle's top-right corner
        this.y = mouseY;
        break;

      case MousePosition.CLICK_LEFT_BOTTOM_CORNER:
        dx = this.x - mouseX;
        dy = mouseY - this.y;

        this.w += dx;
        this.x = mouseX;
        this.h = this.w;
        break;

      case MousePosition.CLICK_RIGHT_BOTTOM_CORNER:
        dx = mouseX - this.x;
        dy = mouseY - this.y;

        this.w = dx;
        this.h = this.w;
        break;
    }
  }
}

export default QrcodeElement;
