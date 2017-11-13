class Iminge {
  oncut = undefined // should be set before cutting

  constructor () {
    this.imageFiles = []
    this.canvas = document.createElement('canvas')
    this.input = document.createElement('input')
    this.input.type = 'file'
    this.input.style = 'hidden'

    // IE 10 needs input to be mounted to trigger click
    document.querySelector('body').appendChild(this.input)
  }

  /**
   * Open a image
   */
  open ({
    accept = 'image/png, image/gif, image/jpeg',
    multiple = false
  }) {
    this.input.accept = accept
    this.input.multiple = multiple

    this.load(this.input.files)
  }

  /**
   * Load a new image
   * @param images {File | File[] | FileList} - The imageFiles
   */
  load (images) {
    if (images.length === undefined) {
      this.imageFiles = [images]
    } else {
      this.imageFiles = Array.from(images)
    }
  }

  /**
   * Cut the imageFiles
   * @param width {number}
   * @param height {number}
   */
  cut (width, height) {
    const canvas = this.canvas
    const imgs = []
    let remaining = this.imageFiles.length

    for (let i = 0; i < this.imageFiles.length; i++) {
      const fileReader = new FileReader()

      // load image file to an image element
      fileReader.onload = (dataUrl) => {
        const imageEl = new Image()

        // resize image via canvas
        imageEl.onload = () => {
          const [finalWidth, finalHeight] = this._calculateFinalSize(width, height, imageEl.width, imageEl.height)

          canvas.width = finalWidth
          canvas.height = finalHeight

          canvas.getContext('2d').drawImage(imageEl, 0, 0, width, height)
          imgs[i] = this._DataUrlToFile(canvas.toDataURL('image/png'))

          // Check if all the images has been resized
          if (--remaining <= 0) {
            typeof this.oncut === 'function' && this.oncut(imgs)
          }
        }

        imageEl.src = dataUrl
      }

      fileReader.readAsDataURL(this.imageFiles[i])
    }
  }

  /**
   * Calculate the final size of output image
   * @param targetWidth
   * @param targetHeight
   * @param width
   * @param height
   * @return {Array}
   * @private
   */
  _calculateFinalSize (targetWidth, targetHeight, width, height) {
    const ratio = width / height
    let w = targetWidth
    let h = targetHeight

    if (!targetWidth && !targetHeight) {
      w = 0
      h = 0
    } else if (!targetHeight) { // if height should be auto
      h = Math.round(w / ratio)
    } else if (!targetWidth) {
      w = Math.round(h * ratio)
    }

    return [w, h]
  }

  /**
   * Convert a dataUrl to a File object
   */
  _DataUrlToFile (dataUrl) {
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)/)

    return new File(atob(matches[2]), {
      type: matches[1]
    })
  }
}

module.exports = Iminge
