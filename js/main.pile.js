var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var invertEm = document.querySelector('#invert');
var swapEm = document.querySelector('#swapChannels');
var shuffleEm = document.querySelector('#shuffleEm');
var upload = document.querySelector('input');
var resetButton = document.querySelector('#reset');
var img = document.querySelector('img');

var shuffle = shuffleInPlaceIgnoringAlphaValues = function shuffleInPlaceIgnoringAlphaValues(arr) {
  for (var i = 0; i < arr.length; i++) {
    // Every 4th index is an alpha value and should be 255. Don't change those.
    if (i % 4 !== 3) {
      // Selection range shrinks by one from left every loop
      // e.g. [0, 1, 2, 3] -> [1, 2, 3] -> [2, 3] -> [3]
      var randIndInRange = Math.floor(Math.random() * arr.length - 1) + 1; // If selection is on 4th index (an alpha value), re-select.

      while (randIndInRange % 4 === 3) {
        randIndInRange = Math.floor(Math.random() * arr.length - 1) + 1;
      } // swap i and random index


      var _swap = arr[i];
      arr[i] = arr[randIndInRange];
      arr[randIndInRange] = _swap;
    }
  }

  return arr;
};

var shufflePixels = function shufflePixels() {
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imgData.data;
  data = shuffle(data);
  ctx.putImageData(imgData, 0, 0);
};

var swap = function swap(channel1, channel2) {
  var colors = ['red', 'green', 'blue'];
  var swap1 = colors.indexOf(channel1);
  var swap2 = colors.indexOf(channel2);
  if (swap1 < 0 || swap2 < 0) throw new Error('Invalid Arguments');
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imgData.data;

  for (var i = 0; i < data.length; i += 4) {
    var temp = data[i + swap1];
    data[i + swap1] = data[i + swap2];
    data[i + swap2] = temp;
  }

  ctx.putImageData(imgData, 0, 0);
};

var invert = invertAllPointsIgnoringAlphaValues = function invertAllPointsIgnoringAlphaValues() {
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imgData.data;
  var newData = [];

  for (var j = 0; j < data.length; j += 4) {
    newData.push(255 - data[j], 255 - data[j + 1], 255 - data[j + 2], 255);
  }

  for (var i = 0; i < data.length; i++) {
    data[i] = newData[i];
  }

  ctx.putImageData(imgData, 0, 0);
};

var uploadHandler = function uploadHandler() {
  var file = upload.files[0];
  img.src = URL.createObjectURL(file);
};

var draw = function draw() {
  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  URL.revokeObjectURL(img.src);
};

if (img.complete) draw();
img.addEventListener('load', draw);
upload.addEventListener('change', uploadHandler);
invertEm.addEventListener('click', invert);
swapEm.addEventListener('click', function () {
  swap(document.querySelector('#channel1').value, document.querySelector('#channel2').value);
});
shuffleEm.addEventListener('click', shufflePixels);
resetButton.addEventListener('click', draw);