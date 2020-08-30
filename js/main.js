const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const invertEm = document.querySelector('#invert');
const swapEm = document.querySelector('#swapChannels');
const shuffleEm = document.querySelector('#shuffleEm');
const upload = document.querySelector('input');
const resetButton = document.querySelector('#reset');
const img = document.querySelector('img');

const shuffle = shuffleInPlaceIgnoringAlphaValues = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    // Every 4th index is an alpha value and should be 255. Don't change those.
    if (i % 4 !== 3) {
      // Selection range shrinks by one from left every loop
      // e.g. [0, 1, 2, 3] -> [1, 2, 3] -> [2, 3] -> [3]
      let randIndInRange = Math.floor(Math.random() * arr.length - 1) + 1;
        // If selection is on 4th index (an alpha value), re-select.
        while (randIndInRange % 4 === 3) {
          randIndInRange = Math.floor(Math.random() * arr.length - 1) + 1;
        }
      // swap i and random index
      let swap = arr[i];
      arr[i] = arr[randIndInRange];
      arr[randIndInRange] = swap;
    }
  }
  return arr;
}

const shufflePixels = () => {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imgData.data;
  data = shuffle(data);
  ctx.putImageData(imgData, 0, 0);
}

const swap = (channel1, channel2) => {
  const colors = ['red', 'green', 'blue'];
  const swap1 =  colors.indexOf(channel1);
  const swap2 =  colors.indexOf(channel2);
  if (swap1 < 0 || swap2 < 0) throw new Error('Invalid Arguments');
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    let temp = data[i + swap1];
    data[i + swap1] = data[i + swap2];
    data[i + swap2] = temp;
  }
  ctx.putImageData(imgData, 0, 0);
}

const invert = invertAllPointsIgnoringAlphaValues = () => {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imgData.data;
  let newData = [];

  for (let j = 0; j < data.length; j += 4) {
    newData.push(255 - data[j], 255 - data[j+1], 255 - data[j+2], 255);
  }
  for (let i = 0; i < data.length; i++) {
    data[i] = newData[i];
  }
ctx.putImageData(imgData, 0, 0);
}

const uploadHandler = () => {
  let file = upload.files[0];
  img.src = URL.createObjectURL(file);
}

const draw = () => {
  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  URL.revokeObjectURL(img.src);
}

if (img.complete) draw();
img.addEventListener('load', draw);
upload.addEventListener('change', uploadHandler);
invertEm.addEventListener('click', invert);
swapEm.addEventListener('click', () => {
  swap(document.querySelector('#channel1').value, document.querySelector('#channel2').value);
})
shuffleEm.addEventListener('click', shufflePixels);
resetButton.addEventListener('click', draw);