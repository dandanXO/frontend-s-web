import Element from "@/views/poster/Element";
import { ResizeType, generateUniqueId } from '@/views/poster/canvasUtil';

class TextArea extends Element {
  constructor(w = 0, h = 0, zIndex = 0, canvas) {
    super(0, 0, w, h, canvas.width, canvas.height, zIndex)
    this.id = generateUniqueId();
  }

  setText(text, color, fontSize, fontFamily) {
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
  }

  async recovery(ratioX, ratioY) {
    super.recovery(ratioX, ratioY)
    this.fontSize = Math.max(ratioX, ratioY) * this.fontSize;
  }

  draw(ctx, isDrawForDownload) {
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = this.color;
    if (!isDrawForDownload) {
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      ctx.setLineDash([]);
    }
    const textWidth = ctx.measureText(this.text).width;
    const words = this.text.split("");
    const num = words.length;
    const widthPerWord = parseInt(textWidth / num);
    const startX = this.x + 5;
    const startY = this.y + this.fontSize
    let curX = startX;
    let curY = startY;
    words.forEach((word) => {
      ctx.fillText(word, curX, curY);
      curX = curX + widthPerWord;
      if (curX >= this.w + this.x - widthPerWord) {
        curX = startX
        curY = curY + this.fontSize;
      }
    })
  }

  getType() {
    return "textArea";
  }

  getResizeType() {
    return ResizeType.EIGHT_DIRECTION
  }
}

export default TextArea;
