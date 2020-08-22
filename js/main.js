const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const shuffleArray = (arr) => {
  newArr = []
  while (arr.length) {
    let targetInd = Math.floor(Math.random() * arr.length)
    newArr.push(arr[targetInd])
    arr.splice(targetInd, 1)
  }
  return newArr
}

const shuffledRgbGroups = () => {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let data = imgData.data
  let chunkedShuffledFlat = shuffleArray(chunk(data, 4)).flat()
  for (let i = 0; i < data.length; i++) {
    data[i] = chunkedShuffledFlat[i]
  }
  ctx.putImageData(imgData, 0, 0)
}

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

const invert = () => {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let data = imgData.data
  let newData = []

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

const chunk = (array, chunkSize) => {
  let arr = []
  for (let i = 0; i < array.length; i++) {
    if (i % chunkSize === 0) arr.push([array[i]])
    else arr[arr.length - 1].push(array[i])
  }
  return arr
}

const img = new Image()
img.src = './img/hallway.jpg'

img.addEventListener('load', () => {
  const inv = document.querySelector('#invert')
  const swap = document.querySelector('#swapChannels')
  const shuffle = document.querySelector('#shuffleEm')
  draw(img)
  inv.addEventListener('click', invert)
  swap.addEventListener('click', swapChannels)
  shuffle.addEventListener('click', shuffledRgbGroups)
})
