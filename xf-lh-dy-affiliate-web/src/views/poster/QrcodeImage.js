import Element from "@/views/poster/Element";

class QrcodeImage extends Element {
  constructor(image, zIndex) {
    super(0, 0, image.width, image.height, zIndex);
    this.image = image;
  }

  replaceImage(image) {
    this.image = image;
  }

  hexToRGBA(hex) {
    if (typeof hex === 'number') {
      hex = hex.toString()
    }

    if (typeof hex !== 'string') {
      throw new Error('Color should be defined as hex string')
    }

    let hexCode = hex.slice().replace('#', '').split('')
    if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
      throw new Error('Invalid hex color: ' + hex)
    }

    // Convert from short to long form (fff -> ffffff)
    if (hexCode.length === 3 || hexCode.length === 4) {
      hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
        return [c, c]
      }))
    }

    // Add default alpha value
    if (hexCode.length === 6) hexCode.push('F', 'F')

    const hexValue = parseInt(hexCode.join(''), 16)

    return {
      r: (hexValue >> 24) & 255,
      g: (hexValue >> 16) & 255,
      b: (hexValue >> 8) & 255,
      a: hexValue & 255,
      hex: '#' + hexCode.slice(0, 6).join('')
    }
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
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }

  getType() {
    return "qrcode";
  }
}

export default QrcodeImage;
