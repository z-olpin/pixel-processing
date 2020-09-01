import { shufflePixels, invert, swap } from './transformations'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const invertEm = document.getElementById('invert');
const swapEm = document.getElementById('swapChannels');
const shuffleEm = document.getElementById('shuffleEm');
const upload = document.getElementById('image-upload');
const resetButton = document.getElementById('reset');
const img = document.getElementById('source-image');

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

if (img.complete) {
  draw();
}
img.addEventListener('load', draw);
upload.addEventListener('change', uploadHandler);
invertEm.addEventListener('click', () => invert(canvas, ctx));
swapEm.addEventListener('click', () => {
  swap(canvas, ctx, document.querySelector('#channel1').value, document.querySelector('#channel2').value);
})
shuffleEm.addEventListener('click', () => shufflePixels(canvas, ctx));
resetButton.addEventListener('click', draw);
