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
})({"js/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hslToRgb = exports.rgbToHsl = void 0;

var rgbToHsl = function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  var min = Math.min(r, g, b); //Min. value of RGB

  var max = Math.max(r, g, b); //Max. value of RGB

  var delta = max - min; //Delta RGB value

  var lum = (max + min) / 2;
  var hue = 0;
  var sat = 0;

  if (delta == 0) {
    return [hue, sat, lum];
  } else {
    if (lum < 0.5) {
      sat = delta / (max + min);
    } else {
      sat = delta / (2 - max - min);
    }

    var deltaR = ((max - r) / 6 + delta / 2) / delta;
    var deltaG = ((max - g) / 6 + delta / 2) / delta;
    var deltaB = ((max - b) / 6 + delta / 2) / delta;

    if (r == max) {
      hue = deltaB - deltaG;
    } else if (g == max) {
      hue = 1 / 3 + deltaR - deltaB;
    } else if (b == max) {
      hue = 2 / 3 + deltaG - deltaR;
    }

    if (hue < 0) {
      hue += 1;
    }

    if (hue > 1) {
      hue -= 1;
    }
  }

  return [hue, sat, lum];
};

exports.rgbToHsl = rgbToHsl;

var hueToRgb = function hueToRgb(q, z, t) {
  if (t < 0) {
    t += 1;
  }

  if (t > 1) {
    t -= 1;
  }

  if (6 * t < 1) {
    return q + (z - q) * 6 * t;
  }

  if (2 * t < 1) {
    return z;
  }

  if (3 * t < 2) {
    return q + (z - q) * (2 / 3 - t) * 6;
  }

  return q;
};

var hslToRgb = function hslToRgb(h, s, l) {
  var r = 0;
  var g = 0;
  var b = 0;
  var q = 0;
  var z = 0;

  if (s == 0) {
    r = l * 255;
    g = l * 255;
    b = l * 255;
  } else {
    if (l < 0.5) {
      q = l * (1 + s);
    } else {
      q = l + s - s * l;
    }

    z = 2 * l - q;
    r = 255 * hueToRgb(z, q, h + 1 / 3);
    g = 255 * hueToRgb(z, q, h);
    b = 255 * hueToRgb(z, q, h - 1 / 3);
    return [r, g, b];
  }

  return [r, g, b];
};

exports.hslToRgb = hslToRgb;
},{}],"js/transformations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.desaturate = exports.sortPixels = exports.invert = exports.swap = exports.shufflePixels = void 0;

var _utils = require("./utils");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  var colors = ["red", "green", "blue"];
  var swap1 = colors.indexOf(channel1);
  var swap2 = colors.indexOf(channel2);
  if (swap1 < 0 || swap2 < 0) throw new Error("Invalid Arguments");
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

  for (var i = 0; i < data.length / 4; i++) {
    var checkpoint = i * 4;
    newData.push((0, _utils.rgbToHsl)(data[checkpoint], data[checkpoint + 1], data[checkpoint + 2]));
  }

  newData.sort(function (hslArr1, hslArr2) {
    return hslArr1[0] - hslArr2[0];
  });

  for (var _i in newData) {
    var _checkpoint = _i * 4;

    var hslArr = newData[_i];

    var _hslToRgb = _utils.hslToRgb.apply(void 0, _toConsumableArray(hslArr)),
        _hslToRgb2 = _slicedToArray(_hslToRgb, 3),
        r = _hslToRgb2[0],
        g = _hslToRgb2[1],
        b = _hslToRgb2[2];

    data[_checkpoint] = r;
    data[_checkpoint + 1] = g;
    data[_checkpoint + 2] = b;
  }

  ctx.putImageData(imgData, 0, 0);
};

exports.sortPixels = sortPixels;

var desaturate = function desaturate(canvas, ctx) {
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imgData.data;

  for (var i = 0; i < data.length; i += 4) {
    var averageLightness = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
    data[i] = data[i + 1] = data[i + 2] = averageLightness;
  }

  ctx.putImageData(imgData, 0, 0);
};

exports.desaturate = desaturate;
},{"./utils":"js/utils.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

var _transformations = require("./transformations");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var invertEm = document.getElementById("invert");
var swapEm = document.getElementById("swapChannels");
var shuffleEm = document.getElementById("shuffleEm");
var sortButton = document.getElementById("sortEm");
var upload = document.getElementById("image-upload");
var resetButton = document.getElementById("reset");
var desaturateButton = document.getElementById("desaturate");
var img = document.getElementById("source-image");

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

img.addEventListener("load", draw);
upload.addEventListener("change", uploadHandler);
invertEm.addEventListener("click", function () {
  return (0, _transformations.invert)(canvas, ctx);
});
swapEm.addEventListener("click", function () {
  (0, _transformations.swap)(canvas, ctx, document.querySelector("#channel1").value, document.querySelector("#channel2").value);
});
sortButton.addEventListener("click", function () {
  return (0, _transformations.sortPixels)(canvas, ctx);
});
shuffleEm.addEventListener("click", function () {
  return (0, _transformations.shufflePixels)(canvas, ctx);
});
desaturateButton.addEventListener("click", function () {
  return (0, _transformations.desaturate)(canvas, ctx);
});
resetButton.addEventListener("click", draw);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52956" + '/');

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