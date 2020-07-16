class ImageOlive {
  /**
  * create an imageOlive,
  * these have some benefits over traditional images,
  */
  constructor () {
    this.image = new Image()
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.imageData = null
    this.width = 0
    this.height = 0
    this.src = ""

    /**
     * see ImageOlive.draw function for details
     */
    this.drawMode = "top-left"
  }

  /**
  * constructor instead of the default constructor because of the need for
  * an async constructor
  * @param {string} src source/url of the image
  * @param {string} callingUrl the base url (generally import.meta.url)
  */
  static async create (src, callingUrl) {
    const imageOlive = new ImageOlive()

    if (src.startsWith('./')) {
      if (callingUrl === undefined) {
        throw Error('supply callingUrl to use relative URLs, i.e., use createImageOlive(url, import.meta.url) instead of createImageOlive(url)')
      }
    }

    callingUrl = callingUrl || location.origin
    const url = new URL(src, callingUrl)
    imageOlive.src = imageOlive.image.src = url.href

    await new Promise((resolve, reject) => {
      imageOlive.image.addEventListener('load', resolve)
      imageOlive.image.addEventListener('error', err => {
        reject("error while loading imageolive")
      })
    })
    imageOlive.width = imageOlive.canvas.width = imageOlive.image.width
    imageOlive.height = imageOlive.canvas.height = imageOlive.image.height
    imageOlive.ctx.drawImage(imageOlive.image, 0, 0)
    imageOlive.imageData = imageOlive.ctx.getImageData(0, 0, imageOlive.width, imageOlive.height)
    return imageOlive
  }

  /**
   * copy an existing imageOlive
   */
  async initCopy(imageOlive){
    this.image = imageOlive.image
    this.width = this.canvas.width = this.image.width
    this.height = this.canvas.height = this.image.height
    this.ctx.drawImage(this.image, 0, 0)
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height)
    return this
  }

  /**
  * all pixels are stored in an UInt8Array,
  * where each index corrosponds to either an r, g, b or a value
  *
  * this returns the indexes for those values
  * @param {number} x - x co-ordinate of the pixel
  * @param {number} y - y co-ordinate of the pixel
  */
  getPixelIndexes (x, y) {
    const red = y * (this.width * 4) + x * 4
    return [red, red + 1, red + 2, red + 3]
  }

  /**
  * get the [r, g, b, a] color of a pixel
  * @param {number} x - x co-ordinate of the pixel
  * @param {number} y - y co-ordinate of the pixel
  */
  getPixelColor (x, y) {
    const [ri, gi, bi, ai] = this.getPixelIndexes(x, y)
    const id = this.imageData.data
    return [id[ri], id[gi], id[bi], id[ai]]
  }

  /**
  * get the [r, g, b, a] color of a pixel
  *
  * @param {number} x - x co-ordinate of the pixel
  * @param {number} y - y co-ordinate of the pixel
  * @param {number[]} color - color of pixels corrosponding to [red, green, blue, alpha] values for pixels
  */
  setPixelColor (x, y, color) {
    const [ri, gi, bi, ai] = this.getPixelIndexes(x, y)
    const [r, g, b, a] = color
    const id = this.imageData.data
    id[ri] = r
    id[gi] = g
    id[bi] = b
    id[ai] = a
  }

  /**
   * draw the image on a canvas context
   *
   * further note:
   * check out ImageOlive.drawMode, this supports multiple options
   *
   * "center" (or "center-center")
   * "top-left" [default]
   * "top-right"
   * "bottom-left"
   * "bottom-right"
   * "center-left"
   * "center-right"
   * "top-center"
   * "bottom-center"
   *
   * basically defines (x, y) corrospond to what of the image
   *
   * so say you choose top-right, then the top-right of the image is where x, y will lie
   *
   * @param canvasOrCtx - the canvas or canvas context or query selector string of the canvas to draw the image on
   * @param {number} x - the x co-ordinate corrosponding to the drawMode
   * @param {number} y - the y co-ordinate corrosponding to the drawMode
   * @param {string} [drawMode] - this overrides the ImageOlive.drawMode parameter
   */
  draw(canvasOrCtx, x=0, y=0, drawMode){
    const ctx = ImageOlive.getContextFromCanvasOrContext(canvasOrCtx);
    [x, y] = ImageOlive.getTopLeftCoords(x, y, this.width, this.height, drawMode||this.drawMode)
    ctx.drawImage(this.canvas, x, y)
  }


  /**
   * if fed a canvas, returns its context, if fed a context, returns the context
   * @param canvasOrCtx - the canvas or canvas context or query selector string of the canvas
   */
  static getContextFromCanvasOrContext(canvasOrCtx){
    if(typeof canvasOrCtx === "string") {
      return document.querySelector(canvasOrCtx).getContext("2d")
    }
    else if(canvasOrCtx instanceof CanvasRenderingContext2D){
      return canvasOrCtx
    } else {
      return canvasOrCtx.getContext("2d")
    }
  }


  /**
   * gets the top-left coords for x, y given the drawMode
   * see the ImageOlive.draw() fn for details on how the drawMode works
   *
   * @param {number} x - the x coord
   * @param {number} y - the y coord
   * @param {number} width
   * @param {number} height
   * @param {string} drawMode - see ImageOlive.draw()
   */
  static getTopLeftCoords(x, y, width, height, drawMode){
    if(drawMode === "center") drawMode = "center-center"
    const [vertical, horizontal] = drawMode.split("-")

    if(vertical === "bottom") y -= height
    else if(vertical === "center") y -= height/2

    if(horizontal === "right") x -= width
    else if(horizontal === "center") x -= width/2

    return [x, y]
  }


  /**
  * runs the given function on each pixel, and converts the color of each pixel accordingly
  *
  * @param cb - the callback to run, this is supplied with the [r, g, b, a] color of the image,and the x and y coordinates in that order, and must return the new [r, g, b, a] value to use
  */
  convertEachPixel (cb) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const color = cb(this.getPixelColor(x, y), x, y)
        this.setPixelColor(x, y, color)
      }
    }
  }

  /**
  * like array.map, but for each pixel
  *
  * @param cb - the callback to run, this is supplied with the [r, g, b, a] color of the image,and the x and y coordinates in that order, and must return the value to store in the array
  * @returns {array} - the array of values containing each value that map returns
  */
  map (cb) {
    var values = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = cb(this.getPixelColor(x, y), x, y)
        values.push(value)
      }
    }
    return values
  }


  /**
   * resize the image in the canvas
   *
   * does this by redrawing the image in the internal canvas so this is a heavy function regardless,
   * of if its inplace or not,
   * so be careful
   *
   * @param {number} width
   * @param {number} height
   * @param {bool} [inplace=false] - do it in the existing ImageOlive, or in a new ImageOlive
   */
  resize(width, height, inplace=false){
    if(inplace){
      this.ctx.drawImage(this.canvas, 0, 0, width, height)
      this.width = this.canvas.width = width
      this.height = this.canvas.height = height
      this.imageData = this.ctx.getImageData(0, 0, this.width, this.height)
    } else{
      const imageOlive = new ImageOlive()
      imageOlive.src = this.src
      imageOlive.image = this.image
      imageOlive.width = imageOlive.canvas.width = width
      imageOlive.height = imageOlive.canvas.height = height
      imageOlive.ctx.drawImage(imageOlive.image, 0, 0, width, height)
      imageOlive.imageData = imageOlive.ctx.getImageData(0, 0, imageOlive.width, imageOlive.height)
      return imageOlive
    }
  }

  /**
   * scale, resize the image by a factor
   */
  scale(wRatio, hRatio, inplace=false){
    return this.resize(wRatio*this.width, hRatio*this.height, inplace)
  }

  /**
   * resize with a consistant aspect ratio
   * i.e. does not skew the image to fit in the resized portion,
   *
   * see resize for parameter meanings
   */
  fit(width, height, inplace=false){
    // calculate the ratio's if we decreased to the height
    // and width while keeping the aspect ratio
    const [wDecRatio, hDecRatio] = [this.width/width, this.height/height]

    // take the smaller resulting photo
    const ratio = Math.min(wDecRatio, hDecRatio)
    return this.scale(ratio, ratio, inplace)
  }
}

/**
* something something something
*/
export default ImageOlive;
