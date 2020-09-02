// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/transformations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortPixels = exports.invert = exports.swap = exports.shufflePixels = void 0;

var shuffle = function shuffle(arr) {
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

var shufflePixels = function shufflePixels(canvas, ctx) {
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imgData.data;
  data = shuffle(data);
  ctx.putImageData(imgData, 0, 0);
};

exports.shufflePixels = shufflePixels;

var swap = function swap(canvas, ctx, channel1, channel2) {
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

exports.swap = swap;

var invert = function invert(canvas, ctx) {
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

exports.invert = invert;

var sortPixels = function sortPixels(canvas, ctx) {
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imgData.data;
  var newData = [];

  for (var i = 0; i < data.length; i += 4) {
    newData.push(data[i].toString(16) + data[i + 1].toString(16) + data[i + 2].toString(16));
  }

  newData.sort();

  for (var _i in newData) {
    var full = newData[_i].padStart(6, '0');

    data[_i * 4] = Number('0x' + full.substring(0, 2));
    data[_i * 4 + 1] = Number('0x' + full.substring(2, 4));
    data[_i * 4 + 2] = Number('0x' + full.substring(4, 6));
  }

  ctx.putImageData(imgData, 0, 0);
};

exports.sortPixels = sortPixels;
},{}],"js/index.js":[function(require,module,exports) {
"use strict";

var _transformations = require("./transformations");

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var invertEm = document.getElementById('invert');
var swapEm = document.getElementById('swapChannels');
var shuffleEm = document.getElementById('shuffleEm');
var sortButton = document.getElementById('sortEm');
var upload = document.getElementById('image-upload');
var resetButton = document.getElementById('reset');
var img = document.getElementById('source-image');

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

if (img.complete) {
  draw();
}

img.addEventListener('load', draw);
upload.addEventListener('change', uploadHandler);
invertEm.addEventListener('click', function () {
  return (0, _transformations.invert)(canvas, ctx);
});
swapEm.addEventListener('click', function () {
  (0, _transformations.swap)(canvas, ctx, document.querySelector('#channel1').value, document.querySelector('#channel2').value);
});
sortButton.addEventListener('click', function () {
  return (0, _transformations.sortPixels)(canvas, ctx);
});
shuffleEm.addEventListener('click', function () {
  return (0, _transformations.shufflePixels)(canvas, ctx);
});
resetButton.addEventListener('click', draw);
},{"./transformations":"js/transformations.js"}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60516" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map