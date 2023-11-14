import {
  CLICK_INSIDE, CLICK_OUTSIDE, CLICK_TOP_BORDER
  , CLICK_LEFT_BORDER, CLICK_BOTTOM_BORDER, CLICK_RIGHT_BORDER
  , CLICK_LEFT_TOP_CORNER, CLICK_RIGHT_TOP_CORNER, CLICK_LEFT_BOTTOM_CORNER, CLICK_RIGHT_BOTTOM_CORNER
} from './Poster';

class Element {
  constructor(x, y, w, h, zIndex) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.zIndex = zIndex;
    this.offsetY = 0;
    this.offsetX = 0;
  }

  move(mouseX, mouseY) {
    this.x = this.offsetX + mouseX;
    this.y = this.offsetY + mouseY;
  }

  resize(mouseX, mouseY) {
    switch (this.resizeType) {
      case CLICK_LEFT_BORDER:
        this.w += this.x - mouseX;
        this.x = mouseX;
        break;
      case CLICK_RIGHT_BORDER:
        this.w = mouseX - this.x;
        break;
      case CLICK_TOP_BORDER:
        this.h += this.y - mouseY;
        this.y = mouseY;
        break;
      case CLICK_BOTTOM_BORDER:
        this.h = mouseY - this.y;
        break;
      case CLICK_LEFT_TOP_CORNER:
        this.w += this.x - mouseX;
        this.x = mouseX;
        this.h += this.y - mouseY;
        this.y = mouseY;
        break;

      case CLICK_RIGHT_TOP_CORNER:
        this.w = mouseX - this.x;
        this.h += this.y - mouseY;
        this.y = mouseY;
        break;

      case CLICK_LEFT_BOTTOM_CORNER:
        this.w += this.x - mouseX;
        this.x = mouseX;
        this.h = mouseY - this.y;
        break;

      case CLICK_RIGHT_BOTTOM_CORNER:
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
      return CLICK_LEFT_TOP_CORNER;
    } else if (this.isNearRightTopCorner(mouseX, mouseY)) {
      return CLICK_RIGHT_TOP_CORNER;
    } else if (this.isNearLeftBottomCorner(mouseX, mouseY)) {
      return CLICK_LEFT_BOTTOM_CORNER;
    } else if (this.isNearRightBottomCorner(mouseX, mouseY)) {
      return CLICK_RIGHT_BOTTOM_CORNER;
    } else if (this.isNearTopBorder(mouseX, mouseY)) {
      return CLICK_TOP_BORDER;
    } else if (this.isNearLeftBorder(mouseX, mouseY)) {
      return CLICK_LEFT_BORDER;
    } else if (this.isNearBottomBorder(mouseX, mouseY)) {
      return CLICK_BOTTOM_BORDER;
    } else if (this.isNearRightBorder(mouseX, mouseY)) {
      return CLICK_RIGHT_BORDER;
    } else if (this.isInRect(mouseX, mouseY)) {
      return CLICK_INSIDE;
    }
    return CLICK_OUTSIDE;
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
    return v * 0.1;
  }

  isNear(s, e) {
    return Math.abs(s - e) < 20;
  }
}

export default Element;
