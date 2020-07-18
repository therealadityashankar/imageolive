import random from "./random.js"

const colors = {}

colors.random = function(hrange=[0, 360], srange=[0, 100], lrange=[0, 100]){
  const [h, s, l] = [random.randrange(...hrange), random.randrange(...srange), random.randrange(...lrange)]
  return `hsl(${h}, ${s}%, ${l}%)`
}

colors.gray = function(howgray=0.5){
  const colorthing = 255*howgray
  return `rgb(${colorthing}, ${colorthing}, ${colorthing})`
}

export default colors;
