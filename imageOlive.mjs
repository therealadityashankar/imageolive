class ImageOlive {
  /**
  * create an imageOlive,
  * these have some benifits over traditional images,
  *
  * mostly that you can add it syncronously, instead of putting
  * @param {string} src source/url of the image
  * @param {string} callingUrl the base url (generally import.meta.url)
  */
  constructor (src, callingUrl) {
    this.image = new Image()
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.imageData = null
    this.width = 0
    this.height = 0

    if (src.startsWith('./')) {
      if (callingUrl === undefined) {
        throw Error('supply callingUrl to use relative URLs, i.e., use createImageOlive(url, import.meta.url) instead of createImageOlive(url)')
      }
    }

    callingUrl = callingUrl || location.origin
    const url = new URL(src, callingUrl)
    this.src = this.image.src = url.href
  }

  /**
  * extra stuff required to initialize properly, this must be called immedietly after the constructor
  */
  async init () {
    await new Promise((resolve, reject) => {
      this.image.addEventListener('load', resolve)
      this.image.addEventListener('error', obj => {
        reject(new Error('invalid image url for imageOlive'))
      })
    })
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
  * set the original image on the canvas, while resetting its size
  * internally uses ctx.drawImage(this.image, 0, 0)
  *
  * @param canvas - the canvas to put the image in
  */
  setOriginal (canvas) {
    canvas.width = this.width
    canvas.height = this.height
    const ctx = canvas.getContext('2d')
    this.drawOriginal(ctx, 0, 0)
  }

  /**
  * draw the original image in a context
  * internally uses ctx.drawImage(this.image, ...params)
  *
  * @param {CanvasRenderingContext2D} ctx - the context to put the image in
  * @param {...params} params - all parameters for ctx.drawImage(...)
  */
  drawOriginal (ctx, ...params) {
    ctx.drawImage(this.image, ...params)
  }

  /**
  * put the image data in a CanvasRenderingContext2D
  * internally uses ctx.putImageData(this.imageData, ...params)
  *
  * @param {CanvasRenderingContext2D} ctx - the context to put the image in
  * @param {...params} params - all parameters for ctx.putImageData(...)
  */
  putImageData (ctx, ...params) {
    ctx.putImageData(this.imageData, ...params)
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
}

/**
* @param {*} params - see ImageOlive params
* @example
* // returns an ImageOlive
* await createImageOlive("some image url", import.meta.url)
*/
const createImageOlive = async (...params) => await (new ImageOlive(...params)).init()
export default createImageOlive
