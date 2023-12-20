import { MousePosition, ResizeType } from './canvasUtil';

class Element {
  constructor(x, y, w, h, canvasW, canvasH, zIndex) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.zIndex = zIndex;
    this.offsetY = 0;
    this.offsetX = 0;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
  }

  move(mouseX, mouseY) {
    if (this.offsetX + mouseX <= 0) {
      this.x = 0;
    } else if (this.offsetX + mouseX + this.w >= this.canvasW) {
      this.x = this.canvasW - this.w;
    } else {
      this.x = this.offsetX + mouseX;
    }

    if (this.offsetY + mouseY <= 0) {
      this.y = 0;
    } else if (this.offsetY + mouseY + this.h >= this.canvasH) {
      this.y = this.canvasH - this.h;
    } else {
      this.y = this.offsetY + mouseY;
    }
  }

  recovery(ratioX, ratioY) {
    this.w = this.w * ratioX;
    this.h = this.h * ratioY;
    this.x = this.x * ratioX;
    this.y = this.y * ratioY;
  }

  resize(mouseX, mouseY) {
    switch (this.resizeType) {
      case MousePosition.CLICK_LEFT_BORDER:
        this.w += this.x - mouseX;
        this.x = mouseX;
        break;
      case MousePosition.CLICK_RIGHT_BORDER:
        this.w = mouseX - this.x;
        break;
      case MousePosition.CLICK_TOP_BORDER:
        this.h += this.y - mouseY;
        this.y = mouseY;
        break;
      case MousePosition.CLICK_BOTTOM_BORDER:
        this.h = mouseY - this.y;
        break;
      case MousePosition.CLICK_LEFT_TOP_CORNER:
        this.w += this.x - mouseX;
        this.x = mouseX;
        this.h += this.y - mouseY;
        this.y = mouseY;
        break;

      case MousePosition.CLICK_RIGHT_TOP_CORNER:
        this.w = mouseX - this.x;
        this.h += this.y - mouseY;
        this.y = mouseY;
        break;

      case MousePosition.CLICK_LEFT_BOTTOM_CORNER:
        this.w += this.x - mouseX;
        this.x = mouseX;
        this.h = mouseY - this.y;
        break;

      case MousePosition.CLICK_RIGHT_BOTTOM_CORNER:
        this.w = mouseX - this.x;
        this.h = mouseY - this.y;
        break;
    }
  }

  startResize(resizeType) {
    this.resizeType = resizeType;
  }

  endResize() {
    this.resizeType = 0;
  }

  updateOffset(mouseX, mouseY) {
    this.offsetX = this.x - mouseX;
    this.offsetY = this.y - mouseY;
  }

  isMouseOverRect(mouseX, mouseY) {
    if (this.isNearLeftTopCorner(mouseX, mouseY)) {
      return MousePosition.CLICK_LEFT_TOP_CORNER;
    } else if (this.isNearRightTopCorner(mouseX, mouseY)) {
      return MousePosition.CLICK_RIGHT_TOP_CORNER;
    } else if (this.isNearLeftBottomCorner(mouseX, mouseY)) {
      return MousePosition.CLICK_LEFT_BOTTOM_CORNER;
    } else if (this.isNearRightBottomCorner(mouseX, mouseY)) {
      return MousePosition.CLICK_RIGHT_BOTTOM_CORNER;
    } else if (this.isNearTopBorder(mouseX, mouseY)) {
      return MousePosition.CLICK_TOP_BORDER;
    } else if (this.isNearLeftBorder(mouseX, mouseY)) {
      return MousePosition.CLICK_LEFT_BORDER;
    } else if (this.isNearBottomBorder(mouseX, mouseY)) {
      return MousePosition.CLICK_BOTTOM_BORDER;
    } else if (this.isNearRightBorder(mouseX, mouseY)) {
      return MousePosition.CLICK_RIGHT_BORDER;
    } else if (this.isInRect(mouseX, mouseY)) {
      return MousePosition.CLICK_INSIDE;
    }
    return MousePosition.CLICK_OUTSIDE;
  }

  isInRect(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    )
  }

  isNearTopBorder(mouseX, mouseY) {
    return (
      mouseX >= this.x + this.nearRate(this.w) &&
      mouseX <= this.x + this.w - this.nearRate(this.w) &&
      mouseY >= this.y - this.nearRate(this.h) &&
      mouseY <= this.y + this.nearRate(this.h)
    )
  }

  isNearLeftBorder(mouseX, mouseY) {
    return (
      mouseX >= this.x - this.nearRate(this.w) &&
      mouseX <= this.x + this.nearRate(this.w) &&
      mouseY >= this.y + this.nearRate(this.h) &&
      mouseY <= this.y + this.h - this.nearRate(this.h)
    )
  }

  isNearBottomBorder(mouseX, mouseY) {
    return (
      mouseX >= this.x + this.nearRate(this.w) &&
      mouseX <= this.x + this.w - this.nearRate(this.w) &&
      mouseY >= this.y + this.h - this.nearRate(this.h) &&
      mouseY <= this.y + this.h + this.nearRate(this.h)
    )
  }

  isNearRightBorder(mouseX, mouseY) {
    return (
      mouseX >= this.x + this.w - this.nearRate(this.w) &&
      mouseX <= this.x + this.w + this.nearRate(this.w) &&
      mouseY >= this.y + this.nearRate(this.h) &&
      mouseY <= this.y + this.h - this.nearRate(this.h)
    )
  }

  isNearLeftTopCorner(mouseX, mouseY) {
    return (
      mouseX >= this.x - this.nearRate(this.w) &&
      mouseX <= this.x + this.nearRate(this.w) &&
      mouseY >= this.y - this.nearRate(this.h) &&
      mouseY <= this.y + this.nearRate(this.h)
    )
  }

  isNearRightTopCorner(mouseX, mouseY) {
    return (
      mouseX >= this.x + this.w - this.nearRate(this.w) &&
      mouseX <= this.x + this.w + +this.nearRate(this.w) &&
      mouseY >= this.y - this.nearRate(this.h) &&
      mouseY <= this.y + this.nearRate(this.h)
    )
  }

  isNearLeftBottomCorner(mouseX, mouseY) {
    return (
      mouseX >= this.x - this.nearRate(this.w) &&
      mouseX <= this.x + this.nearRate(this.w) &&
      mouseY >= this.y + this.h - this.nearRate(this.h) &&
      mouseY <= this.y + this.h + this.nearRate(this.h)
    )
  }

  isNearRightBottomCorner(mouseX, mouseY) {
    return (
      mouseX >= this.x + this.w - this.nearRate(this.w) &&
      mouseX <= this.x + this.w + this.nearRate(this.w) &&
      mouseY >= this.y + this.h - this.nearRate(this.h) &&
      mouseY <= this.y + this.h + this.nearRate(this.h)
    )
  }

  nearRate(v) {
    return v * 0.05;
  }

  isNear(s, e) {
    return Math.abs(s - e) < 20;
  }

  getResizeType() {
    return ResizeType.EIGHT_DIRECTION
  }
}

export default Element;
