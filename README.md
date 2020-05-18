# ImageOlive

- find loading images in js boring ?
- wanted a better way to get images in modules ?
- like dogs ?

Then you've come to the right spot !

### short example

```js
import createImageOlive from "https://cdn.jsdelivr.net/gh/therealadityashankar/imageolive@0.0.1/imageOlive.mjs"

async function dog(){
  const dogpic = await createImageOlive("/static/dogs/woofer.png")
  const canvas = document.getElementById("canvas")
  dogpic.setOriginalOnCanvas(canvas)
}
```

NOTE: the image must be relative to the html document, NOT the file
