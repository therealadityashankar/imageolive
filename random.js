/**
 * get random numbers in a range
 */
const randrange = (min, max) => min + Math.random()*(max-min)
const randint = (min, max) => Math.floor(min + Math.random()*(max-min + 1))
const choice = (arr) => arr[randint(0, arr.length)];

export default {randrange, randint, choice}
