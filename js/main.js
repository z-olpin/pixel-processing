const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

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
  draw(img)
  inv.addEventListener('click', () => invert())
  swap.addEventListener('click', () => swapChannels())
})
