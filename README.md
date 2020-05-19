# ImageOlive

- find loading images in JavaScript boring ?
- wanted a better way to get images in modules ?
- like dogs ?

Then you've come to the right spot !

### short example

```js
import createImageOlive from "https://cdn.jsdelivr.net/gh/therealadityashankar/imageolive@0.0.1/imageOlive.mjs"

async function dog(){
  const dogpic = await createImageOlive("./images/woofer.png", import.meta.url)
  const canvas = document.getElementById("canvas")
  dogpic.setOriginal(canvas)
}
```

NOTE: the image must be relative to the html document, NOT the js file if you don't add the "import.meta" parameter,


## Examples

- to run the provided examples, run a server hosting the top directory for this project, then open the examples,

one way to run the examples is,

- `git clone https://github.com/therealadityashankar/imageolive.git`
- `cd imageolive`
- `python3 -m http.server`

then navigate to one of the examples
