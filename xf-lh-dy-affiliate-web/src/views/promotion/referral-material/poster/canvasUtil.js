export const MousePosition = {
  CLICK_OUTSIDE: 0,
  CLICK_INSIDE: 1,
  CLICK_TOP_BORDER: 2,
  CLICK_BOTTOM_BORDER: 3,
  CLICK_RIGHT_BORDER: 4,
  CLICK_LEFT_BORDER: 5,
  CLICK_LEFT_TOP_CORNER: 6,
  CLICK_RIGHT_TOP_CORNER: 7,
  CLICK_LEFT_BOTTOM_CORNER: 8,
  CLICK_RIGHT_BOTTOM_CORNER: 9,
};

export const ResizeType = {
  FOUR_CORNER: 1,
  EIGHT_DIRECTION: 2,
};

export const loadImage = function (src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      resolve(image);
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}

export const generateUniqueId = function () {
  return 'id' + Math.random().toString(36).substr(2, 9);
}
export const hexToRGBA = function (hex) {
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
