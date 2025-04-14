import Qrcode from './Qrcode'
import TextArea from './TextArea'
import moment from 'moment'
import _ from 'lodash'
import { loadImage, MousePosition, ResizeType } from './canvasUtil'

class Poster {
  constructor(canvas, maxWidth, maxHeight) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.canvas.addEventListener('mousemove', event =>
      this.handleMouseMove(event, this)
    )
    this.canvas.addEventListener('mousedown', event =>
      this.handleMouseDown(event, this)
    )
    this.canvas.addEventListener('mouseup', event =>
      this.handleMouseUp(event, this)
    )
    this.elements = []
    this.pickEle = null
    this.resizeEle = null
    this.canvas.width = maxWidth
    this.canvas.height = maxHeight
    this.eleZindex = 0
  }

  handleMouseMove(event, poster) {
    const rect = poster.canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    if (this.pickEle) {
      this.pickEle.move(mouseX, mouseY)
      this.draw()
      return
    }
    if (this.resizeEle) {
      this.resizeEle.resize(mouseX, mouseY)
      this.draw()
      return
    }

    const e = this.elements
      .filter(e => e.isMouseOverRect(mouseX, mouseY))
      .sort((a, b) => b.zIndex - a.zIndex)
      .pop()
    this.showCursor(e, poster, mouseX, mouseY)
  }

  showCursor(e, poster, mouseX, mouseY) {
    if (e) {
      const type = e.isMouseOverRect(mouseX, mouseY)
      if (type === MousePosition.CLICK_INSIDE) {
        poster.canvas.style.cursor = 'move'
        return
      }

      if (e.getResizeType() === ResizeType.FOUR_CORNER) {
        if (
          type === MousePosition.CLICK_LEFT_TOP_CORNER ||
          type === MousePosition.CLICK_RIGHT_BOTTOM_CORNER
        ) {
          poster.canvas.style.cursor = 'nwse-resize'
        } else if (
          type === MousePosition.CLICK_RIGHT_TOP_CORNER ||
          type === MousePosition.CLICK_LEFT_BOTTOM_CORNER
        ) {
          poster.canvas.style.cursor = 'nesw-resize'
        }
      } else if (e.getResizeType() === ResizeType.EIGHT_DIRECTION) {
        if (
          type === MousePosition.CLICK_TOP_BORDER ||
          type === MousePosition.CLICK_BOTTOM_BORDER
        ) {
          poster.canvas.style.cursor = 'ns-resize'
        } else if (
          type === MousePosition.CLICK_LEFT_BORDER ||
          type === MousePosition.CLICK_RIGHT_BORDER
        ) {
          poster.canvas.style.cursor = 'ew-resize'
        } else if (
          type === MousePosition.CLICK_LEFT_TOP_CORNER ||
          type === MousePosition.CLICK_RIGHT_BOTTOM_CORNER
        ) {
          poster.canvas.style.cursor = 'nwse-resize'
        } else if (
          type === MousePosition.CLICK_RIGHT_TOP_CORNER ||
          type === MousePosition.CLICK_LEFT_BOTTOM_CORNER
        ) {
          poster.canvas.style.cursor = 'nesw-resize'
        }
      }
    } else {
      poster.canvas.style.cursor = 'default'
    }
  }

  handleMouseDown(event, poster) {
    const rect = poster.canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    this.elements
      .filter(e => e.isMouseOverRect(mouseX, mouseY))
      .sort((a, b) => b.zIndex - a.zIndex)
      .findLast(e => {
        const type = e.isMouseOverRect(mouseX, mouseY)
        if (type === MousePosition.CLICK_INSIDE) {
          this.pickEle = e
          e.updateOffset(mouseX, mouseY)
        } else {
          this.resizeEle = e
          e.startResize(type)
        }
      })
  }

  async handleMouseUp(event, poster) {
    poster.canvas.style.cursor = 'default'
    this.pickEle = null
    if (this.resizeEle) {
      await this.resizeEle.endResize()
      this.resizeEle = null
      this.draw()
    }
  }

  async background(src) {
    this.posterBg = await loadImage(src)
    const imageWidth = this.posterBg.width
    const imageHeight = this.posterBg.height
    // const ratio = parseFloat(imageWidth) / parseFloat(imageHeight);
    this.originWidth = imageWidth
    this.originHeight = imageHeight
    this.w = this.canvas.width
    this.h = this.canvas.height
    this.ctx.drawImage(this.posterBg, 0, 0, this.w, this.h)
  }

  async qrcode(
    data = { data: '', dark: '#000000', light: '#ffffff', radius: 0, margin: 2 }
  ) {
    const color = { dark: data.dark, light: data.light }
    let qrcode = this.elements.filter(e => e.getType() === 'qrcode').pop()
    if (qrcode) {
      await qrcode.generateQrcode(data.data, color, data.radius, data.margin)
    } else {
      qrcode = new Qrcode(100, 100, ++this.eleZindex, this.canvas)
      await qrcode.generateQrcode(data.data, color, data.radius, data.margin)
      this.elements.push(qrcode)
    }
    this.draw()
  }

  async text(
    data = {
      text: '',
      color: 'black',
      fontSize: 20,
      fontFamily: 'Arial',
      id: '',
      backgroundColor: 'white',
    }
  ) {
    let textArea
    if (data.id) {
      textArea = this.elements
        .filter(e => e.getType() === 'textArea' && e.id === data.id)
        .pop()
      if (textArea) {
        textArea.setText(
          data.id,
          data.text,
          data.color,
          data.fontSize,
          data.fontFamily,
          data.backgroundColor
        )
      } else {
        textArea = new TextArea(100, 100, ++this.eleZindex, this.canvas)
        textArea.setText(
          data.id,
          data.text,
          data.color,
          data.fontSize,
          data.fontFamily,
          data.backgroundColor
        )
        this.elements.push(textArea)
      }
    } else {
      textArea = new TextArea(100, 100, ++this.eleZindex, this.canvas)
      textArea.setText(
        data.id,
        data.text,
        data.color,
        data.fontSize,
        data.fontFamily,
        data.backgroundColor
      )
      this.elements.push(textArea)
    }
    await this.draw()
    return textArea ? textArea.id : ''
  }

  draw(isDrawForDownload = false) {
    this.ctx.clearRect(0, 0, this.w, this.h)
    this.ctx.drawImage(this.posterBg, 0, 0, this.w, this.h)
    this.elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(e => {
        e.draw(this.ctx, isDrawForDownload)
      })
  }

  downloadFullSize() {
    const dataURL = this.canvas.toDataURL('image/jpg')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `${moment().format('YYYYMMDDHHmmss')}.jpg`
    a.click()
  }

  async loadElements(elements, resizeX, resizeY) {
    const ratioX = parseFloat(this.w) / parseFloat(resizeX)
    const ratioY = parseFloat(this.h) / parseFloat(resizeY)
    this.elements = _.cloneDeep(elements)
    for (const e of this.elements) {
      await e.recovery(ratioX, ratioY)
    }
    this.draw(true)
  }

  async download() {
    const tempCanvas = document.createElement('canvas')
    document.body.appendChild(tempCanvas)
    tempCanvas.style.display = 'none'
    const tempPoster = new Poster(
      tempCanvas,
      this.originWidth,
      this.originHeight
    )
    await tempPoster.background(this.posterBg.src)
    await tempPoster.loadElements(this.elements, this.w, this.h)
    tempPoster.downloadFullSize()
    tempCanvas.parentNode.removeChild(tempCanvas)
  }

  clearQR() {
    this.elements = this.elements.filter(e => e.getType() === 'textArea')
    this.draw()
  }

  clearText() {
    this.elements = this.elements.filter(e => e.getType() === 'qrcode')
    this.draw()
  }

  removeTextById(id) {
    const index = this.elements.findIndex(e => e.getType() === 'textArea' && e.id === id)
    this.elements.splice(index, 1)
    this.draw()
  }
}

export default Poster
