# ImageOlive

- find loading images in js boring ?
- wanted a better way to get images in modules ?
- like dogs ?

Then you've come to the right spot !

### short example

```js
import createImageOlive from "./imageOlive.mjs"

async function dog(){
  const dogpic = await createImageOlive("/static/dogs/woofer.png")
  const canvas = document.getElementById("canvas")
  dogpic.setOriginalOnCanvas(canvas)
}
```
