import random from "./random.js"

const colors = {}

colors.random = function(hrange=[0, 360], srange=[0, 100], lrange=[0, 100]){
  const [h, s, l] = [random.randrange(...hrange), random.randrange(...srange), random.randrange(...lrange)]
  return `hsl(${h}, ${s}%, ${l}%)`
}

export default colors;
