// TODO: Re shuffling being hideously slow...
// The chunking not actually so bad on its own.
// (Although still interested to try lodash or compare to Numpy/itertools)
// But trying to store that many arrays in mem might be major
// slowdown for shuffleArray. Alternatively, shuffleArray might
// itself be the problem. (e.g. splicing that many times...)

// 1. Try shuffling an unchuncked array to narrow it down. (See line #42)
// 2. Instead of slicing, just restrict the selection range when adding to new array. (see line #32)
// 3. Compare chunking to lodash/numpy/itertools.
// 4. Do on backend instead.

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// ~ 38ms
const chunk = (array, chunkSize) => {
  let arr = []
  for (let i = 0; i < array.length; i++) {
    if (i % chunkSize === 0) arr.push([array[i]])
    else arr[arr.length - 1].push(array[i])
  }
  return arr
}

// ~ 5098ms (!!)
const shuffleArray = (arr) => {
  newArr = []
  while (arr.length) {
    let targetInd = Math.floor(Math.random() * arr.length)
    newArr.push(arr[targetInd])
    arr.splice(targetInd, 1)
  }
  return newArr
}

// ~ 20 - 50ms after subtracting shuffleArray
const shuffledRgbGroups = () => {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let data = imgData.data
  let chunkedShuffledFlat = shuffleArray(chunk(data, 4)).flat()
  for (let i = 0; i < data.length; i++) {
    data[i] = chunkedShuffledFlat[i]
  }
  ctx.putImageData(imgData, 0, 0)
}

// ~23ms
const swapChannels = () => {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let data = imgData.data
  let newData = []

  for (let j = 0; j < data.length; j += 4) {
    newData.push(data[j+2], data[j+1], data[j], 255)
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = newData[i]
  }

  ctx.putImageData(imgData, 0, 0);
}

// ~ 23ms
const invert = () => {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let data = imgData.data
  let newData = []

  // invert
  for (let j = 0; j < data.length; j += 4) {
    newData.push(255 - data[j], 255 - data[j+1], 255 - data[j+2], 255)
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = newData[i]
  }

ctx.putImageData(imgData, 0, 0);
}

const draw = img => {
  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0)
}

const img = new Image()
img.src = './img/hallway.jpg'
img.addEventListener("load", () => {
  const inv = document.querySelector('#invert')
  const swap = document.querySelector('#swapChannels')
  const shuffleEm = document.querySelector('#shuffleEm')
  draw(img)
  inv.addEventListener('click', () => invert())
  swap.addEventListener('click', () => swapChannels())
  shuffleEm.addEventListener('click', () => shuffledRgbGroups())
})
