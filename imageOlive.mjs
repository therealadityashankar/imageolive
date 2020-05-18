class ImageOlive{
  constructor(src){
    this.image = new Image()
    this.canvas = document.createElement("canvas")
    this.ctx = this.canvas.getContext("2d")
    this.imageData = null
    this.width = 0
    this.height = 0
    this.src = src
    this.image.src = src
  }

  async init(){
    await new Promise(resolve => this.image.addEventListener("load", resolve))
    this.width = this.canvas.width = this.image.width
    this.height = this.canvas.height = this.image.height
    this.ctx.drawImage(this.image, 0, 0)
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height)
    return this
  }

  getPixelIndexes(x, y){
    const red = y * (this.width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  getPixelColor(x, y){
    const [ri, gi, bi, ai] = this.getPixelIndexes(x, y)
    const id = this.imageData.data
    return [id[ri], id[gi], id[bi], id[ai]]
  }

  setPixelColor(x, y, color){
    const [ri, gi, bi, ai] = this.getPixelIndexes(x, y)
    const [r, g, b, a] = color
    const id = this.imageData.data
    id[ri] = r
    id[gi] = g
    id[bi] = b
    id[ai] = a
  }

  setOriginalOnCanvas(canvas){
    canvas.width = this.width
    canvas.height = this.height
    const ctx = canvas.getContext("2d")
    this.drawImageOnCtx(ctx, 0, 0)
  }

  drawOriginalImageOnCtx(ctx, x, y){
    ctx.drawImage(this.image, x, y)
  }

  putImageDataOnCtx(ctx, x, y){
    ctx.putImageData(this.imageData, x, y)
  }

  convertEachPixel(cb){
    for(let y=0; y<this.height; y++){
      for(let x=0; x<this.width; x++){
        const color = cb(this.getPixelColor(x, y), x, y)
        this.setPixelColor(x, y, color)
      }
    }
  }

  map(cb){
    var values = []
    for(let y=0; y<this.height; y++){
      for(let x=0; x<this.width; x++){
        const value = cb(this.getPixelColor(x, y), x, y)
        values.push(value)
      }
    }
    return values
  }
}

const createImageOlive = async src => await (new ImageOlive(src)).init()
export default createImageOlive
