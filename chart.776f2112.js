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
})({"helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DomHelper = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DomHelper =
/*#__PURE__*/
function () {
  function DomHelper() {
    _classCallCheck(this, DomHelper);
  }

  _createClass(DomHelper, null, [{
    key: "div",
    value: function div(className, target, html) {
      var el = document.createElement('div');
      el.className = className;

      if (html) {
        el.innerHTML = html;
      }

      if (target) {
        target.appendChild(el);
      }

      return el;
    }
  }, {
    key: "svg",
    value: function svg(tag, target, className) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', tag);

      if (className) {
        el.setAttribute('class', className);
      }

      if (target) {
        target.appendChild(el);
      }

      return el;
    }
  }, {
    key: "style",
    value: function style(target, html) {
      var el = document.createElement('style');

      if (html) {
        el.innerHTML = html;
      }

      if (target) {
        target.appendChild(el);
      }

      return el;
    }
  }]);

  return DomHelper;
}();

exports.DomHelper = DomHelper;
},{}],"header.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = void 0;

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SEARCH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" style="fill: #48AAF0;" viewBox="0 0 330 330"><path d="M325.606 304.394L223.328 202.117c16.707-21.256 26.683-48.041 26.683-77.111C250.011 56.077 193.934 0 125.005 0 56.077 0 0 56.077 0 125.006 0 193.933 56.077 250.01 125.005 250.01c29.07 0 55.855-9.975 77.11-26.681l102.278 102.277c2.929 2.93 6.768 4.394 10.607 4.394s7.678-1.464 10.606-4.394c5.859-5.857 5.859-15.355 0-21.212zM30 125.006C30 72.619 72.619 30 125.005 30c52.387 0 95.006 42.619 95.006 95.005 0 52.386-42.619 95.004-95.006 95.004C72.619 220.01 30 177.391 30 125.006z"/><path d="M175.01 110.006H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h100.01c8.284 0 15-6.716 15-15s-6.716-15-15-15z"/></svg>';
var STYLES = "\n    .header {\n        position: relative;\n        display: flex;\n        font-weight: 600;\n        align-items: center;\n        min-height: 50px;\n    }\n    .header.--zoomed > .header-title {\n        opacity: 0;\n        font-size: 8px;\n        transform: translateY(-30px);\n    }\n    .header.--zoomed > .header-zoom {\n        opacity: 1;\n        font-size: 15px;\n        transform: translateY(0);\n    }\n    .header-title {\n        flex-grow: 1;\n        line-height: 50px;\n        font-size: 15px;\n        opacity: 1;\n        transform: translateY(0);\n        transition: 0.2s transform, 0.2s opacity, 0.2s font-size;\n    }\n    .header-zoom {\n        position: absolute;\n        left: 0;\n        top: 0;\n        font-size: 8px;\n        line-height: 50px;\n        color: #48AAF0;\n        display: flex;\n        align-items: center;\n        opacity: 0;\n        transform: translateY(30px);\n        transition: 0.2s transform, 0.2s opacity, 0.2s font-size;\n        cursor: pointer;\n    }\n    .header-zoom > svg {\n        margin-right: 10px;\n        width: 18px;\n        height: 18px;\n    }\n    .header-days {\n        position: absolute;\n        right: 0;\n        top: 0;\n        line-height: 50px;\n        font-size: 13px;\n        flex-shrink: 0;\n    }\n    .header-days.--show-down {\n        animation: show-up 0.2s 1 ease-in-out;\n    }\n    .header-days.--show-up {\n        animation: show-down 0.2s 1 ease-in-out;\n    }\n    .header-days.--hide-down {\n        animation: hide-up 0.2s 1 ease-in-out;\n    }\n    .header-days.--hide-up {\n        animation: hide-down 0.2s 1 ease-in-out;\n    }\n    @keyframes show-up {\n        0% {transform:translateY(-30px);opacity:0;font-size:7px;}\n        100%{transform:translateY(0);opacity:1;font-size:13px;}\n    }\n    @keyframes show-down {\n        0% {transform:translateY(30px);opacity:0;font-size:7px;}\n        100%{transform:translateY(0);opacity:1;font-size:13px;}\n    }\n    @keyframes hide-up {\n        0% {transform:translateY(0);opacity:1;font-size:13px;}\n        100%{transform:translateY(-30px);opacity:0;font-size:7px;}\n    }\n    @keyframes hide-down {\n        0% {transform:translateY(0);opacity:1;font-size:13px;}\n        100%{transform:translateY(30px);opacity:0;font-size:7px;}\n    }\n";

var Header =
/*#__PURE__*/
function () {
  function Header(props, setProps) {
    _classCallCheck(this, Header);

    this.setProps = setProps;

    _helpers.DomHelper.style(props.shadow, STYLES);

    this.header = _helpers.DomHelper.div('header', props.target);
  }

  _createClass(Header, [{
    key: "render",
    value: function render(props) {
      var _this = this;

      this.title = _helpers.DomHelper.div('header-title', this.header, props.title);

      var headerZoom = _helpers.DomHelper.div('header-zoom', this.header, "".concat(SEARCH_ICON, "Zoom out"));

      headerZoom.onclick = function () {
        return _this.zoomOut();
      };

      this.headerDays = _helpers.DomHelper.div('header-days', this.header);
    }
  }, {
    key: "zoomOut",
    value: function zoomOut() {
      this.setProps({
        isZoomed: false
      });
    }
  }, {
    key: "isZoomed",
    value: function isZoomed(props) {
      if (props.isZoomed) {
        this.header.classList.add('--zoomed');
      } else {
        this.header.classList.remove('--zoomed');
      }
    }
  }, {
    key: "range",
    value: function range(props) {
      var _this2 = this;

      var timeLine = props.timeLine;

      if (!timeLine || !timeLine.length) {
        this.headerDays.innerHTML = null;
        return;
      }

      var startIndex = Math.floor(timeLine.length * props.startRange / 100);
      var endIndex = Math.ceil(timeLine.length * props.endRange / 100);
      var startDate = new Date(timeLine[startIndex]);
      var endDate = new Date(timeLine[endIndex - 1]);
      var startDay = startDate.getDate();
      var endDay = endDate.getDate();
      var value;

      if (timeLine[endIndex - 1] - timeLine[startIndex] < 25 * 60 * 60 * 1000 && startDay === endDay) {
        var dayName = props.daysLabels[startDate.getDay()];
        var monthName = props.monthsLabels[startDate.getMonth()];
        var year = startDate.getFullYear();
        value = "".concat(dayName, ", ").concat(startDay, " ").concat(monthName, " ").concat(year);
      } else {
        var _monthName = props.monthsLabels[startDate.getMonth()];
        var endMonthName = props.monthsLabels[endDate.getMonth()];

        var _year = startDate.getFullYear();

        var endYear = endDate.getFullYear();
        value = "".concat(startDay, " ").concat(_monthName, " ").concat(_year, " - ").concat(endDay, " ").concat(endMonthName, " ").concat(endYear);
      }

      if (value !== this.prevDaysVal && this.prevDaysVal) {
        this.prevDaysVal = value;
        var isUp = props.startRange > this.prevStartRange;
        this.prevStartRange = props.startRange;

        var headerDays = _helpers.DomHelper.div("header-days ".concat(isUp ? '--show-up' : '--show-down'), this.header, value);

        this.headerDays.addEventListener('animationend', function () {
          _this2.header.removeChild(_this2.headerDays);

          _this2.headerDays = headerDays;
        });
        this.headerDays.classList.add(!isUp ? '--hide-up' : '--hide-down');
      } else {
        this.prevDaysVal = value;
        this.headerDays.innerHTML = value;
      }
    }
  }, {
    key: "update",
    value: function update(newProps) {
      var _this3 = this;

      this.isZoomed(newProps);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        _this3.range(newProps);
      }, 50);
    }
  }, {
    key: "init",
    value: function init(newProps) {
      this.render(newProps);
      this.range(newProps);
    }
  }]);

  return Header;
}();

exports.Header = Header;
},{"./helpers":"helpers.js"}],"loading.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loading = void 0;

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STYLES = "\n    .loading{\n        display: flex;\n        position: absolute;\n        left: 0;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        font-size: 25px;\n        align-items: center;\n        justify-content: center;\n        opacity: 0;\n        transform: translateY(-30px);\n        transition: 0.2s transform, 0.2s opacity;\n        pointer-events: none;\n    }\n    .loading.--visible {\n        opacity: 1;\n        transform: translateY(0);\n    }\n";

var Loading =
/*#__PURE__*/
function () {
  function Loading(props, setProps) {
    _classCallCheck(this, Loading);

    this.setProps = setProps;

    _helpers.DomHelper.style(props.shadow, STYLES);

    this.loading = _helpers.DomHelper.div('loading', props.target, 'Loading...');
    this.isLoading(props);
  }

  _createClass(Loading, [{
    key: "isLoading",
    value: function isLoading(props) {
      if (props.isLoading) {
        this.loading.classList.add('--visible');
      } else {
        this.loading.classList.remove('--visible');
      }
    }
  }, {
    key: "update",
    value: function update(newProps) {
      this.isLoading(newProps);
    }
  }, {
    key: "init",
    value: function init(newProps) {
      this.isLoading(newProps);
    }
  }]);

  return Loading;
}();

exports.Loading = Loading;
},{"./helpers":"helpers.js"}],"switchers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Switchers = void 0;

var _helpers = require("./helpers");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CHECK_ICON = '<svg class="icon" style="margin-right:6px; width: 12px; height: 12px;vertical-align: middle;fill: #fff;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 143.8c-34.6-26.8-83-18.6-108.2 18.2L428 688.4l-198.2-214.6c-29.2-33.2-78.2-34.8-109.4-3.6-31.2 31-32.8 83.2-3.4 116.2 0 0 240.8 267.2 275.4 294 34.6 26.8 83 18.6 108.2-18.2l412.6-603.4C938.4 221.8 930.6 170.4 896 143.8z" /></svg>';
var STYLES = "\n    .switchers {\n        margin-top: 17px;\n        display: flex;\n        flex-wrap: wrap;\n        opacity: 1;\n        transition: 0.2s opacity;\n    }\n    .switchers.--off {\n        opacity: 0;\n        pointer-events: none;\n    }\n    .switchers.--abs {\n        position:relative;\n        margin-top: -40px;\n    }\n    .switcher {\n        height: 36px;\n        border-radius: 18px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: 11px;\n        font-weight: 600;\n        position: relative;\n        cursor: pointer;\n        margin: 6px;\n        flex-shrink: 0;\n        white-space: nowrap;\n    }\n    .switcher.--off .switcher-front {\n        opacity: 0;\n        transform: translateY(-30px);\n        pointer-events: none;\n    }\n    .switcher-back {\n        padding: 0 24px;\n        line-height: 32px;\n        border: 2px solid;\n        border-radius: 18px;\n        white-space: nowrap;\n    }\n    .switcher-front {\n        white-space: nowrap;\n        border-radius: 18px;\n        left: 0;\n        top: 0;\n        position: absolute;\n        padding: 0 17px;\n        line-height: 36px;\n        color: #fff;\n        display: flex;\n        align-items: center;\n        transform: translateY(0px);\n        opacity: 1;\n        transition: 0.3s transform, 0.3s opacity;\n    }\n";

var Switcher =
/*#__PURE__*/
function () {
  function Switcher(line, props, setProps) {
    var _this = this;

    _classCallCheck(this, Switcher);

    this.line = line;
    this.props = props;
    this.setProps = setProps;
    this.switcher = _helpers.DomHelper.div('switcher', this.props.target);

    this.switcher.onclick = function () {
      return _this.onClick();
    };

    this.hiddenLines(this.props);
    this.render();
  }

  _createClass(Switcher, [{
    key: "render",
    value: function render() {
      var switcherBack = _helpers.DomHelper.div('switcher-back', this.switcher, this.line.name);

      switcherBack.style.borderColor = this.line.color;
      switcherBack.style.color = this.line.color;

      var switcherFront = _helpers.DomHelper.div('switcher-front', this.switcher, "".concat(CHECK_ICON).concat(this.line.name));

      switcherFront.style.backgroundColor = this.line.color;
    }
  }, {
    key: "onClick",
    value: function onClick() {
      var hiddenLines = _toConsumableArray(this.props.hiddenLines);

      var index = hiddenLines.indexOf(this.line.id);

      if (index > -1) {
        hiddenLines.splice(index, 1);
      } else {
        hiddenLines.push(this.line.id);
      }

      this.setProps({
        hiddenLines: hiddenLines
      });
    }
  }, {
    key: "hiddenLines",
    value: function hiddenLines(props) {
      var index = props.hiddenLines.indexOf(this.line.id);

      if (index > -1) {
        this.switcher.classList.add('--off');
      } else {
        this.switcher.classList.remove('--off');
      }
    }
  }, {
    key: "update",
    value: function update(newProps) {
      this.hiddenLines(newProps);
      this.props = newProps;
    }
  }]);

  return Switcher;
}();

var Switchers =
/*#__PURE__*/
function () {
  function Switchers(props, setProps) {
    _classCallCheck(this, Switchers);

    this.target = props.target;
    this.setProps = setProps;

    _helpers.DomHelper.style(props.shadow, STYLES);
  }

  _createClass(Switchers, [{
    key: "render",
    value: function render(props) {
      var _this2 = this;

      this.switcherList = props.lines.map(function (line) {
        return new Switcher(line, _objectSpread({}, props, {
          target: _this2.switchers
        }), _this2.setProps);
      });
    }
  }, {
    key: "update",
    value: function update(newProps) {
      if (newProps.zoomInit) {
        if (newProps.lines.length === 1) {
          this.switchers.classList.add('--off');
        } else {
          this.switchers.classList.remove('--off');
        }

        this.switchers.innerHTML = null;
        this.render(newProps);
      }

      this.switcherList.forEach(function (switcher) {
        switcher.update(newProps);
      });
    }
  }, {
    key: "init",
    value: function init(newProps) {
      this.switchers = _helpers.DomHelper.div("switchers ".concat(newProps.lines.length === 1 ? '--abs --off' : ''), this.target);
      this.render(newProps);
    }
  }]);

  return Switchers;
}();

exports.Switchers = Switchers;
},{"./helpers":"helpers.js"}],"navigator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Navigator = void 0;

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NAV_HEIGHT = 40;
var NAV_HEIGHT_INNER = 38;
var NAV_STROKE_WIDTH = 2;
var STYLES = "\n    .navigator {\n        height: ".concat(NAV_HEIGHT, "px;\n        border-radius: 5px;\n        overflow: hidden;\n        position:relative;\n        opacity: 1;\n        transition: 0.2s opacity;\n    }\n    .navigator.--off {\n        opacity: 0;\n        pointer-events: none;\n    }\n    .nav-wrapper {\n        display: flex;\n        align-items: center;\n    }\n    .nav-left, .nav-right {\n        background-color: #E2EEF9;\n        opacity: 0.6;\n        height: ").concat(NAV_HEIGHT_INNER, "px;\n        flex-shrink:0;\n        width: 100%;\n        transform: translateX(5px);\n    }\n    .--night .nav-left, .--night .nav-right {\n        background-color: #304259;\n    }\n    .nav-right {\n        transform: translateX(-5px);\n    }\n    .nav-right {\n        flex-shrink:0;\n        width: 100%;\n        height: ").concat(NAV_HEIGHT_INNER, "px;\n        background-color: #E2EEF9;\n        opacity: 0.6;\n    }\n    .nav-selector {\n        flex-shrink:0;\n        height: ").concat(NAV_HEIGHT_INNER, "px;\n        border: 1px solid #C0D1E1;\n        border-left-width: 10px;\n        border-right-width: 10px;\n        border-radius: 5px;\n        z-index: 1;\n        cursor: pointer;\n        position:relative;\n    }\n    .--night .nav-selector {\n        border-color: #56626D;\n    }\n    .nav-selector:before, .nav-selector:after {\n        content: '';\n        position: absolute;\n        left: -6px;\n        top: 15px;\n        width:2px;\n        height:10px;\n        background-color:#fff;\n        border-radius: 2px;\n    }\n    .nav-selector:after {\n        left: auto;\n        right: -6px;\n    }\n    .nav-click-left, .nav-click-right {\n        position: absolute;\n        left: -38px;\n        width: 40px;\n        top: 0;\n        height: 100%;\n    }\n    .nav-click-right {\n        left: auto;\n        right: -38px;\n    }\n    .nav-svg-wrapper {\n        border-radius: 5px;\n        overflow: hidden;\n        position: absolute;\n        left: 0;\n        top: 1px;\n        width: 100%;\n        height: ").concat(NAV_HEIGHT_INNER, "px;\n        overflow: hidden;\n        transform: scale(1, -1);\n    }\n    .nav-svg {\n        position: absolute;\n        left: 0;\n        top: 0;\n    }\n    .nav-svg-path {\n        vector-effect: non-scaling-stroke;\n        stroke-width: ").concat(NAV_STROKE_WIDTH, ";\n        opacity: 1;\n        transition: 0.2s opacity;\n    }\n    .nav-svg-path.--off {\n        opacity: 0;\n    }\n");

var Navigator =
/*#__PURE__*/
function () {
  function Navigator(props, setProps) {
    var _this = this;

    _classCallCheck(this, Navigator);

    this.setProps = setProps;
    document.addEventListener('mouseup', function () {
      return _this.mouseUp();
    });
    document.addEventListener('mousemove', function (event) {
      return _this.mouseMove(event);
    });
    document.addEventListener('touchend', function () {
      return _this.mouseUp();
    });
    document.addEventListener('touchmove', function (event) {
      return _this.mouseMove(event);
    });

    _helpers.DomHelper.style(props.shadow, STYLES);

    this.navigator = _helpers.DomHelper.div('navigator', props.target);
  }

  _createClass(Navigator, [{
    key: "mouseDown",
    value: function mouseDown(event, clickedSide) {
      event.stopPropagation();
      this.clickX = typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX;
      this.clickProps = this.props;
      this.clickedSide = clickedSide;
      document.body.style.userSelect = 'none';
    }
  }, {
    key: "mouseUp",
    value: function mouseUp() {
      document.body.style.userSelect = '';
      this.clickX = null;
    }
  }, {
    key: "mouseMove",
    value: function mouseMove(event) {
      if (typeof this.clickX !== 'number') {
        return;
      }

      var startPixels = this.clickProps.width * this.clickProps.startRange / 100;
      var endPixels = this.clickProps.width * this.clickProps.endRange / 100;
      var diff = (typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX) - this.clickX;
      var newStartPixels = startPixels + diff;
      var newEndPixels = endPixels + diff;
      var newStartRange = newStartPixels * 100 / this.clickProps.width;
      var newEndRange = newEndPixels * 100 / this.clickProps.width;
      var diffRange = newEndRange - newStartRange;
      var newProps;

      if (this.clickedSide === 1) {
        if (newStartRange < 0) {
          newStartRange = 0;
        }

        if (newStartRange + 10 > this.clickProps.endRange) {
          newStartRange = this.clickProps.endRange - 10;
        }

        if (newStartRange === this.clickProps.startRange) {
          return;
        }

        newProps = {
          startRange: newStartRange,
          endRange: this.clickProps.endRange
        };
      } else if (this.clickedSide === 3) {
        if (newEndRange > 100) {
          newEndRange = 100;
        }

        if (newEndRange - 10 < this.clickProps.startRange) {
          newEndRange = this.clickProps.startRange + 10;
        }

        if (newEndRange === this.clickProps.newEndRange) {
          return;
        }

        newProps = {
          endRange: newEndRange,
          startRange: this.clickProps.startRange
        };
      } else {
        if (newStartRange < 0) {
          newStartRange = 0;
          newEndRange = diffRange;
        }

        if (newEndRange > 100) {
          newEndRange = 100;
          newStartRange = 100 - diffRange;
        }

        if (newStartRange === this.clickProps.startRange) {
          return;
        }

        newProps = {
          startRange: newStartRange,
          endRange: newEndRange
        };
      }

      if (newProps.startRange === this.clickProps.startRange && newProps.endRange === this.clickProps.endRange) {
        return;
      }

      newProps.scaleRange = (newProps.endRange - newProps.startRange) / 100;
      newProps.chartWidth = this.clickProps.width / newProps.scaleRange;
      newProps.left = newProps.chartWidth * newProps.startRange / 100;
      newProps.hoveredIndex = null;
      this.setProps(newProps);
    }
  }, {
    key: "hiddenLines",
    value: function hiddenLines(props) {
      var _this2 = this;

      props.lines.forEach(function (line) {
        if (props.hiddenLines.indexOf(line.id) > -1) {
          _this2.paths[line.id].path.classList.add('--off');
        } else {
          _this2.paths[line.id].path.classList.remove('--off');
        }
      });
    }
  }, {
    key: "renderLines",
    value: function renderLines(props) {
      this.navSvgWrapper.innerHTML = null;
      this.svg = _helpers.DomHelper.svg('svg', this.navSvgWrapper, 'nav-svg');
      this.svg.setAttribute('width', props.width);
      this.svg.setAttribute('height', NAV_HEIGHT_INNER);
      this.paths = {};
      var scaleY = (NAV_HEIGHT_INNER - NAV_STROKE_WIDTH) / props.allMaxY;

      for (var index = 0; index < props.lines.length; index += 1) {
        var line = props.lines[index];

        if (props.stacked || props.percentage) {
          line = props.lines[props.lines.length - 1 - index];
        }

        if (props.yScaled && index === props.lines.length - 1) {
          scaleY = (NAV_HEIGHT_INNER - NAV_STROKE_WIDTH) / props.yScaledAllMaxY;
        }

        var path = _helpers.DomHelper.svg('path', this.svg, 'nav-svg-path');

        if (line.path) {
          path.setAttribute('d', line.path);
          path.setAttribute('transform', "scale(1,".concat(scaleY * line.fixScaleY, ")"));
        }

        path.setAttribute('stroke', line.color);

        if (line.type === 'area' || line.type === 'bar') {
          path.setAttribute('fill', line.color);
        } else {
          path.setAttribute('fill', 'none');
        }

        this.paths[line.id] = {
          path: path
        };
      }

      this.navWrapper.style.transform = "translateX(-".concat(100 - props.startRange, "%)");
      this.navSelector.style.width = "calc(".concat(props.endRange - props.startRange, "% - 20px)");
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      this.navSvgWrapper = _helpers.DomHelper.div('nav-svg-wrapper', this.navigator);
      this.navWrapper = _helpers.DomHelper.div('nav-wrapper', this.navigator);

      _helpers.DomHelper.div('nav-left', this.navWrapper);

      this.navSelector = _helpers.DomHelper.div('nav-selector', this.navWrapper);

      this.navSelector.onmousedown = function (event) {
        return _this3.mouseDown(event, 2);
      };

      this.navSelector.ontouchstart = function (event) {
        return _this3.mouseDown(event, 2);
      };

      _helpers.DomHelper.div('nav-right', this.navWrapper);

      this.navClickLeft = _helpers.DomHelper.div('nav-click-left', this.navSelector);

      this.navClickLeft.onmousedown = function (event) {
        return _this3.mouseDown(event, 1);
      };

      this.navClickLeft.ontouchstart = function (event) {
        return _this3.mouseDown(event, 1);
      };

      this.navClickRight = _helpers.DomHelper.div('nav-click-right', this.navSelector);

      this.navClickRight.onmousedown = function (event) {
        return _this3.mouseDown(event, 3);
      };

      this.navClickRight.ontouchstart = function (event) {
        return _this3.mouseDown(event, 3);
      };
    }
  }, {
    key: "range",
    value: function range(props) {
      this.navWrapper.style.transform = "translateX(-".concat(100 - props.startRange, "%)");
      this.navSelector.style.width = "calc(".concat(props.endRange - props.startRange, "% - 20px)");
      var scaleY = (NAV_HEIGHT_INNER - NAV_STROKE_WIDTH) / props.allMaxY;

      if (props.stacked || props.percentage || props.zoomInit) {
        for (var index = 0; index < props.lines.length; index += 1) {
          var line = props.lines[index];

          if (props.stacked || props.percentage) {
            line = props.lines[props.lines.length - 1 - index];
          }

          if (props.yScaled && index === props.lines.length - 1) {
            scaleY = (NAV_HEIGHT_INNER - NAV_STROKE_WIDTH) / props.yScaledAllMaxY;
          }

          if (props.hiddenLines.indexOf(line.id) === -1 && line.path) {
            this.paths[line.id].path.setAttribute('d', line.path);
            this.paths[line.id].path.setAttribute('transform', "scale(1,".concat(scaleY * line.fixScaleY, ")"));
          }
        }
      }
    }
  }, {
    key: "update",
    value: function update(newProps) {
      var _this4 = this;

      if (newProps.zoomInit) {
        this.renderLines(newProps);

        if (newProps.hideNavigator) {
          this.navigator.classList.add('--off');
        } else {
          this.navigator.classList.remove('--off');
        }
      }

      this.hiddenLines(newProps);
      requestAnimationFrame(function () {
        _this4.range(newProps);

        _this4.props = newProps;
      });
    }
  }, {
    key: "init",
    value: function init(newProps) {
      this.render();
      this.renderLines(newProps);
      this.props = newProps;
    }
  }]);

  return Navigator;
}();

exports.Navigator = Navigator;
},{"./helpers":"helpers.js"}],"axis-x.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AxisX = void 0;

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STYLES = "\n    .axis-x {\n        line-height: 25px;\n        color: #8E8E93;\n        font-size: 9px;\n        display: flex;\n        position: absolute;\n        left: 0;\n        height: 25px;\n        bottom: 10px;\n    }\n    .axis-x-item {\n        position: absolute;\n        top: 0;\n        left: 0;\n        margin-left: -30px;\n        text-align: center;\n        width: 60px;\n        transition: 0.2s opacity;\n    }\n    .axis-x-item.--show {\n        animation: axis-x-show 0.2s 1 ease-in-out;\n    }\n    .axis-x-item.--hide {\n        animation: axis-x-hide 0.2s 1 ease-in-out;\n    }\n    @keyframes axis-x-show {\n        0% {opacity:0;}\n        100%{opacity:1;}\n    }\n    @keyframes axis-x-hide {\n        0% {opacity:1;}\n        100%{opacity:0;}\n    }\n";

var AxisX =
/*#__PURE__*/
function () {
  function AxisX(props, setProps) {
    _classCallCheck(this, AxisX);

    this.setProps = setProps;
    this.target = props.target;

    _helpers.DomHelper.style(props.shadow, STYLES);

    this.axisX = _helpers.DomHelper.div('axis-x', this.target);
    this.items = [];
  }

  _createClass(AxisX, [{
    key: "render",
    value: function render(props) {
      var _this = this;

      var blockWidth = props.chartWidth / this.blockAmount;
      var prev;

      var _loop = function _loop(i) {
        var position = i * props.chartWidth / (props.timeLine.length - 1);

        if (!prev && prev !== 0 || prev + blockWidth < position) {
          if (!_this.items[i]) {
            var date = new Date(props.timeLine[i]);
            var value;

            if (props.isZoomed) {
              value = "".concat(date.getHours() > 9 ? date.getHours() : "0".concat(date.getHours()), ":").concat(date.getMinutes() > 9 ? date.getMinutes() : "0".concat(date.getMinutes()));
            } else {
              value = "".concat(date.getDate(), " ").concat(props.monthsLabels[date.getMonth()].substring(0, 3));
            }

            _this.items[i] = _helpers.DomHelper.div('axis-x-item --show', _this.axisX, value);
          } else {
            _this.items[i].classList.remove('--hide');

            _this.items[i].classList.add('--show');
          }

          _this.items[i].style.left = "".concat(position, "px");
          prev = position;
        } else if (_this.items[i]) {
          _this.items[i].style.left = "".concat(position, "px");

          _this.items[i].classList.remove('--show');

          _this.items[i].addEventListener('animationend', function () {
            if (_this.items[i]) {
              _this.axisX.removeChild(_this.items[i]);

              _this.items[i] = null;
            }
          });

          _this.items[i].classList.add('--hide');
        }
      };

      for (var i = 0; i < props.timeLine.length; i += 1) {
        _loop(i);
      }
    }
  }, {
    key: "getBlockAmount",
    value: function getBlockAmount(props) {
      if (props.chartWidth / this.blockAmount > 90) {
        this.blockAmount *= 2;
      }

      if (props.chartWidth / this.blockAmount < 45) {
        this.blockAmount *= 0.5;
      }
    }
  }, {
    key: "update",
    value: function update(newProps) {
      if (newProps.zoomInit) {
        this.axisX.innerHTML = null;
        this.items = [];
        this.blockAmount = 2;

        while (newProps.chartWidth / this.blockAmount * 2 > 90) {
          this.blockAmount *= 2;
        }
      }

      this.getBlockAmount(newProps);
      this.render(newProps);
    }
  }, {
    key: "init",
    value: function init(newProps) {
      this.blockAmount = 2;

      while (newProps.chartWidth / this.blockAmount * 2 > 90) {
        this.blockAmount *= 2;
      }

      this.getBlockAmount(newProps);
      this.render(newProps);
    }
  }]);

  return AxisX;
}();

exports.AxisX = AxisX;
},{"./helpers":"helpers.js"}],"axis-y.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AxisY = void 0;

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STYLES = "\n    .axis-y {\n        position: absolute;\n        left: 16px;\n        top: 0;\n        bottom: 35px;\n        right: 16px;\n        opacity: 1;\n        transition: 0.2s opacity;\n        pointer-events: none;\n        z-index: 1000;\n    }\n    .axis-y.--off {\n        opacity: 0;\n    }\n    .--night .axis-y-item {\n        border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n    }\n    .axis-y-item {\n        position: absolute;\n        left: 0;\n        right: 0;\n        border-bottom: 1px solid rgba(24, 45, 59, 0.1);\n        line-height: 20px;\n        font-size: 9px;\n        color: #8E8E93;\n    }\n    .axis-y-item.--right {\n        text-align: end;\n        border-bottom: 1px solid rgba(24, 45, 59, 0.05);\n    }\n    .--night .axis-y-item.--right {\n        border-bottom: 1px solid rgba(255, 255, 255, 0.05);\n    }\n    .axis-y-items {\n        position: absolute;\n        left: 0;\n        top: 0;\n        bottom: 0;\n        right: 0;\n    }\n    .axis-y-items.--show-down {\n        animation: axis-show-up 0.2s 1 ease-in-out;\n    }\n    .axis-y-items.--show-up {\n        animation: axis-show-down 0.2s 1 ease-in-out;\n    }\n    .axis-y-items.--hide-down {\n        animation: axis-hide-up 0.2s 1 ease-in-out;\n    }\n    .axis-y-items.--hide-up {\n        animation: axis-hide-down 0.2s 1 ease-in-out;\n    }\n    @keyframes axis-show-up {\n        0% {transform:translateY(-30px);opacity:0;}\n        100%{transform:translateY(0);opacity:1;}\n    }\n    @keyframes axis-show-down {\n        0% {transform:translateY(30px);opacity:0;}\n        100%{transform:translateY(0);opacity:1;}\n    }\n    @keyframes axis-hide-up {\n        0% {transform:translateY(0);opacity:1;}\n        100%{transform:translateY(-30px);opacity:0;}\n    }\n    @keyframes axis-hide-down {\n        0% {transform:translateY(0);opacity:1;}\n        100%{transform:translateY(30px);opacity:0;}\n    }\n";

var AxisY =
/*#__PURE__*/
function () {
  function AxisY(props, setProps, isRight) {
    _classCallCheck(this, AxisY);

    this.isRight = isRight;
    this.setProps = setProps;

    _helpers.DomHelper.style(props.shadow, STYLES);

    this.axisY = _helpers.DomHelper.div('axis-y', props.target);
  }

  _createClass(AxisY, [{
    key: "fillItems",
    value: function fillItems(axisItems, props) {
      var blockHeight;
      var amountBlocks;

      if (props.percentage) {
        amountBlocks = 5;
        blockHeight = props.chartHeight / (amountBlocks - 1);
      } else {
        amountBlocks = 6;
        blockHeight = (props.chartHeight - 20) / (amountBlocks - 1);
      }

      var scaleY = props.chartHeight / this.maxY;

      for (var i = 1; i < amountBlocks; i += 1) {
        var value = i * blockHeight / scaleY;

        if (value > 1000000) {
          value = "".concat((value / 1000000).toFixed(2), "KK");
        } else if (value > 1000) {
          value = "".concat((value / 1000).toFixed(2), "K");
        } else {
          value = "".concat(Math.round(value));
        }

        if (props.percentage) {
          value = "".concat(Math.round(i * 100 / (amountBlocks - 1)));
        }

        var axisItem = this.createItem(props, axisItems, value);
        axisItem.style.bottom = i * blockHeight;
      }
    }
  }, {
    key: "createItem",
    value: function createItem(props, target, value) {
      var item = _helpers.DomHelper.div("axis-y-item".concat(this.isRight ? ' --right' : ''), target, value);

      if (props.yScaled && !this.isRight) {
        item.style.color = props.lines[0].color;
      } else if (props.yScaled) {
        item.style.color = props.lines[props.lines.length - 1].color;
      }

      return item;
    }
  }, {
    key: "updateAxis",
    value: function updateAxis(props, isUp) {
      var _this = this;

      var axisItems = _helpers.DomHelper.div("axis-y-items ".concat(isUp ? '--show-up' : '--show-down'), this.axisY);

      this.fillItems(axisItems, props);
      this.axisItems.addEventListener('animationend', function () {
        _this.axisY.removeChild(_this.axisItems);

        _this.axisItems = axisItems;
      });
      this.axisItems.classList.add(!isUp ? '--hide-up' : '--hide-down');
    }
  }, {
    key: "update",
    value: function update(newProps) {
      var _this2 = this;

      if (this.isRight && !newProps.yScaled) {
        return;
      }

      if (newProps.lines.length === newProps.hiddenLines.length || this.isRight && newProps.yScaled && newProps.hiddenLines.indexOf(newProps.lines[newProps.lines.length - 1].id) > -1 || !this.isRight && newProps.yScaled && newProps.lines.length - 1 === newProps.hiddenLines.length && newProps.hiddenLines.indexOf(newProps.lines[newProps.lines.length - 1].id) === -1) {
        this.axisY.classList.add('--off');
      } else {
        this.axisY.classList.remove('--off');
      }

      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        var maxY = !_this2.isRight ? newProps.rangeMaxY : newProps.yScaledRangeMaxY;

        if (maxY === _this2.maxY) {
          return;
        }

        var isUp = maxY < _this2.maxY;
        _this2.maxY = maxY;

        _this2.updateAxis(newProps, isUp);
      }, 50);
    }
  }, {
    key: "init",
    value: function init(newProps) {
      if (this.isRight && !newProps.yScaled) {
        this.axisY.classList.add('--off');
        return;
      }

      this.maxY = !this.isRight ? newProps.rangeMaxY : newProps.yScaledRangeMaxY;
      var item0 = this.createItem(newProps, this.axisY, '0');
      item0.style.bottom = 0;
      this.axisItems = _helpers.DomHelper.div('axis-y-items', this.axisY);
      this.fillItems(this.axisItems, newProps);
    }
  }]);

  return AxisY;
}();

exports.AxisY = AxisY;
},{"./helpers":"helpers.js"}],"lines.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Lines = void 0;

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STROKE_WIDTH = 3;
var STYLES = "\n    .lines-svg {\n        opacity: 1;\n        transition: 0.2s opacity;\n        transform: scale(1, -1);\n    }\n    .lines-svg.--hover {\n        opacity: 0.5;\n    }\n    .line-svg-path {\n        vector-effect: non-scaling-stroke;\n        opacity: 1;\n        stroke-width: ".concat(STROKE_WIDTH, ";\n        transition: 0.2s opacity;\n    }\n    .line-svg-path.--off {\n        opacity: 0;\n    }\n");

var Lines =
/*#__PURE__*/
function () {
  function Lines(props, setProps) {
    _classCallCheck(this, Lines);

    this.setProps = setProps;
    this.target = props.target;

    _helpers.DomHelper.style(props.shadow, STYLES);

    this.svg = _helpers.DomHelper.svg('svg', this.target, 'lines-svg');
  }

  _createClass(Lines, [{
    key: "render",
    value: function render(props) {
      this.svg.setAttribute('width', props.chartWidth);
      this.svg.setAttribute('height', props.chartHeight); // const scaleY = maxY / this.maxY;
      // const viewBoxHeight = props.chartHeight * scaleY;
      // this.prevValueTop = props.chartHeight - viewBoxHeight;
      // this.prevValueHeight = props.chartHeight * scaleY;
      // this.keyIndex = 0;
      // this.svg.setAttribute('viewBox', `0 ${this.prevValueTop} ${props.width} ${this.prevValueHeight}`);

      this.paths = {};
      this.svg.innerHTML = null;
      var scaleY = props.chartHeight / props.rangeMaxY;
      var scaleX = props.width / props.chartWidth;

      for (var index = 0; index < props.lines.length; index += 1) {
        var line = props.lines[index];

        if (props.stacked || props.percentage) {
          line = props.lines[props.lines.length - 1 - index];
        }

        if (props.yScaled && index === props.lines.length - 1) {
          scaleY = props.chartHeight / props.yScaledRangeMaxY;
        }

        var path = _helpers.DomHelper.svg('path', this.svg, 'line-svg-path');

        if (line.path) {
          path.setAttribute('d', line.path);
          path.setAttribute('transform', "scale(".concat(1 / scaleX, ",").concat(scaleY * line.fixScaleY, ")"));
        }

        path.setAttribute('stroke', line.color);

        if (line.type === 'area' || line.type === 'bar') {
          path.setAttribute('fill', line.color);
        } else {
          path.setAttribute('fill', 'none');
        }

        this.paths[line.id] = {
          path: path
        };
      }
    }
  }, {
    key: "hiddenLines",
    value: function hiddenLines(props) {
      var _this = this;

      props.lines.forEach(function (line) {
        var path = _this.paths[line.id].path;

        if (props.hiddenLines.indexOf(line.id) > -1) {
          path.classList.add('--off');
        } else {
          path.classList.remove('--off');
        }
      });
    }
  }, {
    key: "updateScale",
    value: function updateScale(props) {
      var _this2 = this;

      if ((props.hoveredIndex || props.hoveredIndex === 0) && props.lines[0].type === 'bar') {
        this.svg.classList.add('--hover');
      } else {
        this.svg.classList.remove('--hover');
      }

      this.svg.setAttribute('width', props.chartWidth);
      var scaleY = props.chartHeight / props.rangeMaxY;
      var scaleX = props.width / props.chartWidth;
      props.lines.forEach(function (line, index) {
        if (props.hiddenLines.indexOf(line.id) === -1) {
          if (props.yScaled && index === props.lines.length - 1) {
            scaleY = props.chartHeight / props.yScaledRangeMaxY;
          }

          var path = _this2.paths[line.id].path;

          if (line.path) {
            path.setAttribute('d', line.path);
            path.setAttribute('transform', "scale(".concat(1 / scaleX, ",").concat(scaleY * line.fixScaleY, ")"));
          }
        }
      });
    } // updateViewBox(props) {
    //     const startIndex = Math.floor(props.timeLine.length * props.startRange / 100);
    //     const endIndex = Math.ceil(props.timeLine.length * props.endRange / 100);
    //     let maxY = 0;
    //     props.lines.forEach((line) => {
    //         if (props.hiddenLines.indexOf(line.id) === -1) {
    //             for (let i = startIndex; i <= endIndex; i += 1) {
    //                 if (i >= 0 && i < line.column.length && maxY < line.column[i]) {
    //                     maxY = line.column[i];
    //                 }
    //             }
    //         }
    //     });
    //     const scaleY = maxY / this.maxY;
    //     const viewBoxHeight = props.chartHeight * scaleY;
    //     this.svg.setAttribute('width', props.chartWidth);
    //     this.startValueTop = this.prevValueTop;
    //     this.startValueHeight = this.prevValueHeight;
    //     this.stepTop = (props.chartHeight - viewBoxHeight - this.prevValueTop) / 12;
    //     this.stepHeight = (props.chartHeight * scaleY - this.prevValueHeight) / 12;
    //     this.keyIndex += 1;
    //     clearTimeout(this.timeout);
    //     this.timeout = setTimeout(() => {
    //         this.startAnimation(0, this.keyIndex, props);
    //     }, 50);
    // }
    // startAnimation(index, key, props) {
    //     if (this.keyIndex !== key || index > 11) {
    //         return;
    //     }
    //     requestAnimationFrame(() => {
    //         this.prevValueTop = this.startValueTop + this.stepTop * index;
    //         this.prevValueHeight = this.startValueHeight + this.stepHeight * index;
    //         this.svg.setAttribute('viewBox', `0 ${this.prevValueTop} ${props.width} ${this.prevValueHeight}`);
    //         this.startAnimation(index + 1, key, props);
    //     });
    // }

  }, {
    key: "update",
    value: function update(newProps) {
      if (newProps.zoomInit) {
        this.render(newProps);
      }

      this.updateScale(newProps);
      this.hiddenLines(newProps);
    }
  }, {
    key: "init",
    value: function init(newProps) {
      this.render(newProps);
    }
  }]);

  return Lines;
}();

exports.Lines = Lines;
},{"./helpers":"helpers.js"}],"tooltip.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tooltip = void 0;

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ARROW_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><g data-name="Group 1"><path data-name="Rectangle 1" fill="none" d="M21 21H0V0h21z"/><path data-name="Path 1" d="M15.59 11.49l-8.6 8.6A1.4 1.4 0 1 1 5 18.11l7.6-7.61-7.6-7.6A1.4 1.4 0 0 1 6.99.9l8.6 8.6a1.4 1.4 0 0 1 0 1.98z" fill="#D2D5D7"/></g></svg>';
var STYLES = "\n    .tooltip {\n        position: absolute;\n        left: 0;\n        top: 10px;\n        width: 140px;\n        box-shadow: 0px 0px 10px -3px rgba(0,0,0,0.75);\n        border-radius: 8px;\n        background-color:#fff;\n        opacity: 1;\n        transition: 0.2s opacity;\n        padding: 4px 10px;\n        font-size: 12px;\n        z-index: 1001;\n    }\n    .--night .tooltip {\n        background-color: #1C2533;\n        box-shadow: none;\n    }\n    .tooltip.--off {\n        opacity: 0;\n        pointer-events: none;\n    }\n    .tooltip-hover {\n        position: absolute;\n        top: 0;\n        left: 0;\n        border-left: 1px solid rgba(24, 45, 59, 0.1);\n        bottom: 35;\n        pointer-events: none;\n        opacity: 1;\n        transition: 0.2s opacity;\n    }\n    .--night .tooltip-hover {\n        border-left: 1px solid rgba(255, 255, 255, 0.1);\n    }\n    .tooltip-hover.--bar {\n        border: 0;\n    }\n    .tooltip-date {\n        font-weight: 600;\n        margin: 6px 0;\n        display: flex;\n        justify-content: space-between;\n        pointer-events: none;\n    }\n    .tooltip-date > svg {\n        width: 12px;\n        height: 10px;\n    }\n    .tooltip-item {\n        display:flex;\n        margin: 6px 0;\n        justify-content: space-between;\n        pointer-events: none;\n    }\n    .tooltip-item > span {\n        display: flex;\n    }\n    .tooltip-item > span > span {\n        min-width: 25px;\n        text-align: right;\n        font-weight: 600;\n        margin-right: 7px;\n        display: block;\n    }\n    .tooltip-item > span.--all {\n        font-weight: 600;\n    }\n    .tooltip-hover.--off {\n        opacity: 0;\n    }\n    .hover-item {\n        background-color: #fff;\n        position: absolute;\n        bottom: 0;\n        width: 8px;\n        height: 8px;\n        pointer-events: none;\n        margin: 0 0 -6px -6px;\n        border-radius: 50%;\n        border: 2px solid;\n    }\n    .--night .hover-item {\n        background-color: #242F3E;\n    }\n    .hover-item.--area {\n        opacity: 1;\n    }\n    .hover-item.--bar {\n        left: -1px;\n        height: auto;\n        border-radius: 0;\n        border: 0;\n        margin: 0;\n    }\n";

var Tooltip =
/*#__PURE__*/
function () {
  function Tooltip(props, setProps) {
    var _this = this;

    _classCallCheck(this, Tooltip);

    this.target = props.target;
    this.props = props;
    this.setProps = setProps;

    _helpers.DomHelper.style(props.shadow, STYLES);

    this.tooltip = _helpers.DomHelper.div('tooltip --off', props.target);

    this.tooltip.onclick = function (event) {
      return _this.clickTooltip(event);
    };
  }

  _createClass(Tooltip, [{
    key: "render",
    value: function render(props) {
      var _this2 = this;

      this.target.addEventListener('mouseenter', function (event) {
        return _this2.mouseEnter(event);
      });
      this.target.addEventListener('mouseleave', function (event) {
        return _this2.mouseLeave(event);
      });
      this.target.addEventListener('mousemove', function (event) {
        return _this2.mouseMove(event);
      });
      this.target.addEventListener('touchmove', function (event) {
        _this2.selectedIndex = null;

        _this2.mouseMove(event);
      });
      this.target.addEventListener('touchend', function (event) {
        _this2.mouseMove(event);

        setTimeout(function () {
          _this2.mouseClick(event);
        });
      });
      this.target.addEventListener('click', function (event) {
        return _this2.mouseClick(event);
      });
      document.addEventListener('click', function () {
        return _this2.mouseLeave();
      });
      this.hover = _helpers.DomHelper.div('tooltip-hover --off', this.target);

      if (props.lines[0].type === 'bar') {
        this.hover.classList.add('--bar');
      }
    }
  }, {
    key: "clickTooltip",
    value: function clickTooltip(event) {
      event.stopPropagation();

      if (this.props.isZoomed) {
        return;
      }

      var zoomedIndex = this.selectedIndex;
      this.selectedIndex = null;
      this.setProps({
        zoomedIndex: zoomedIndex
      });
    }
  }, {
    key: "mouseEnter",
    value: function mouseEnter() {
      this.chartRect = this.target.getBoundingClientRect();
    }
  }, {
    key: "mouseLeave",
    value: function mouseLeave() {
      this.selectedIndex = null;
      this.setProps({
        hoveredIndex: null
      });
    }
  }, {
    key: "mouseClick",
    value: function mouseClick(event) {
      event.stopPropagation();

      if (this.props.hiddenLines.length === this.props.lines.length) {
        return;
      }

      this.selectedIndex = this.props.hoveredIndex;
      this.hoveredValue(this.props);
    }
  }, {
    key: "mouseMove",
    value: function mouseMove(event) {
      this.positions = [];

      if (this.props.lines[0].type === 'bar') {
        this.amount = this.props.timeLine.length;
      } else {
        this.amount = this.props.timeLine.length - 1;
      }

      var blockWidth = this.props.chartWidth / this.amount;

      if (!this.chartRect) {
        this.chartRect = this.target.getBoundingClientRect();
      }

      var clientX;

      if (event && typeof event.clientX === 'number') {
        clientX = event.clientX;
      } else if (event && event.touches[0]) {
        clientX = event.touches[0].clientX;
      } else {
        clientX = this.prevClientX;
      }

      clientX -= this.chartRect.left;
      this.prevClientX = clientX;
      var prev = -1;
      var hoveredIndex;

      for (var i = -1; i <= this.props.timeLine.length; i += 1) {
        var position = i * blockWidth - this.props.left + this.props.chartIndent;
        this.positions[i] = {
          clientX: clientX,
          position: position
        };

        if (position > 0) {
          if (prev < clientX && clientX < position) {
            if (Math.abs(prev - clientX) > Math.abs(position - clientX)) {
              hoveredIndex = i;
            } else {
              hoveredIndex = i - 1;
            }
          }

          prev = position;
        }
      }

      if (hoveredIndex < 0) {
        hoveredIndex = 0;
      }

      if (hoveredIndex >= this.props.timeLine.length) {
        hoveredIndex = this.props.timeLine.length - 1;
      }

      if (!event || this.props.hoveredIndex === hoveredIndex) {
        return;
      }

      if (hoveredIndex || hoveredIndex === 0) {
        this.setProps({
          hoveredIndex: hoveredIndex
        });
      } else {
        this.setProps({
          hoveredIndex: null
        });
      }
    }
  }, {
    key: "hoveredValue",
    value: function hoveredValue(props) {
      var _this3 = this;

      var index = props.hoveredIndex;
      this.prevIndex = index;

      if ((this.selectedIndex || this.selectedIndex === 0) && !props.isZoomed) {
        index = this.selectedIndex;
      }

      if (!index && index !== 0 || props.hiddenLines.length === props.lines.length || !this.positions[index]) {
        this.hover.classList.add('--off');
        this.tooltip.classList.add('--off');
        return;
      }

      if (props.isZoomed || this.selectedIndex || this.selectedIndex === 0) {
        this.tooltip.classList.remove('--off');
      } else {
        this.tooltip.classList.add('--off');
      }

      this.hover.classList.remove('--off');

      if (this.positions[index].position > 200) {
        this.tooltip.style.transform = "translateX(".concat(this.positions[index].position - 160 - 17, "px)");
      } else {
        this.tooltip.style.transform = "translateX(".concat(this.positions[index].position + 17, "px)");
      }

      this.tooltip.innerHTML = null;
      var date = new Date(props.timeLine[index]);
      var dateStr;

      if (props.isZoomed) {
        dateStr = "".concat(date.getHours() > 9 ? date.getHours() : "0".concat(date.getHours()), ":").concat(date.getMinutes() > 9 ? date.getMinutes() : "0".concat(date.getMinutes()));
      } else {
        dateStr = "".concat(props.daysLabels[date.getDay()].substring(0, 3), ", ").concat(date.getDate(), " ").concat(props.monthsLabels[date.getMonth()].substring(0, 3), " ").concat(date.getFullYear()).concat(ARROW_ICON);
      }

      _helpers.DomHelper.div('tooltip-date', this.tooltip, dateStr);

      props.lines.forEach(function (line) {
        if (props.hiddenLines.indexOf(line.id) === -1) {
          var name = line.name;

          if (props.percentage) {
            name = "<span>".concat(Math.round(line.column[index] / props.allColumnData[index] * 100), "%</span>").concat(name);
          }

          var item = _helpers.DomHelper.div('tooltip-item', _this3.tooltip);

          item.innerHTML = "<span>".concat(name, "</span><span style=\"color:").concat(line.color, "\">").concat(line.column[index], "</span>");
        }
      });
      var scaleY = props.chartHeight / props.rangeMaxY;
      this.hover.innerHTML = null;
      this.hover.style.transform = "translateX(".concat(this.positions[index].position, "px)");
      var prevValue = 0;
      var blockWidth = Math.ceil(props.chartWidth / this.amount) + 1;
      props.lines.forEach(function (line, i) {
        if (props.yScaled && i === props.lines.length - 1) {
          scaleY = props.chartHeight / props.yScaledRangeMaxY;
        }

        if (props.hiddenLines.indexOf(line.id) === -1) {
          var hoverItem = _helpers.DomHelper.div("hover-item --".concat(line.type), _this3.hover);

          hoverItem.style.bottom = "".concat((prevValue + line.column[index]) * scaleY, "px");
          hoverItem.style.borderColor = line.color;

          if (line.type === 'bar') {
            hoverItem.style.top = "".concat(props.chartHeight - (prevValue + line.column[index]) * scaleY, "px");
            hoverItem.style.bottom = 0;
            hoverItem.style.width = blockWidth;
            hoverItem.style.backgroundColor = line.color;
            hoverItem.style.zIndex = props.lines.length - i;
          }

          if (props.stacked) {
            prevValue += line.column[index];
          }
        }
      });

      if (props.stacked && !props.percentage) {
        _helpers.DomHelper.div('tooltip-item', this.tooltip, "<span>".concat('All', "</span><span class=\"--all\">", prevValue, "</span>"));
      }
    }
  }, {
    key: "update",
    value: function update(newProps) {
      var _this4 = this;

      if (newProps.zoomInit) {
        this.tooltip.innerHTML = null;
        this.hover.innerHTML = null;
        this.positions = [];
        this.props = newProps;
        this.mouseMove();
      }

      requestAnimationFrame(function () {
        _this4.hoveredValue(newProps);

        _this4.props = newProps;
      });
    }
  }, {
    key: "init",
    value: function init(newProps) {
      this.render(newProps);
      this.props = newProps;
    }
  }]);

  return Tooltip;
}();

exports.Tooltip = Tooltip;
},{"./helpers":"helpers.js"}],"chart-wrapper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartWrapper = void 0;

var _helpers = require("./helpers");

var _axisX = require("./axis-x");

var _axisY = require("./axis-y");

var _lines = require("./lines");

var _tooltip = require("./tooltip");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STYLES = "\n    .chart-wrapper {\n        position: relative;\n        margin: 0 -16px;\n        cursor: pointer;\n    }\n    .svg-wrapper {\n        position: absolute;\n        left: 0;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        will-change:transform;\n        pointer-events: none;\n    }\n    .message {\n        position: absolute;\n        left: 0;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        align-items: center;\n        justify-content: center;\n        opacity: 0;\n        display: none;\n        transition: 0.2s opacity;\n    }\n    .message.--on {\n        display: flex;\n        opacity: 1;\n    }\n";

var ChartWrapper =
/*#__PURE__*/
function () {
  function ChartWrapper(props, setProps) {
    _classCallCheck(this, ChartWrapper);

    this.setProps = setProps;

    _helpers.DomHelper.style(props.shadow, STYLES);

    this.chartWrapper = _helpers.DomHelper.div('chart-wrapper', props.target);
    this.render(props);
  }

  _createClass(ChartWrapper, [{
    key: "render",
    value: function render(props) {
      var _this = this;

      this.svgWrapper = _helpers.DomHelper.div('svg-wrapper', this.chartWrapper);
      this.message = _helpers.DomHelper.div('message', this.chartWrapper, 'Please, choose at least the one line ¯\\_(ツ)_/¯');
      this.lines = new _lines.Lines(_objectSpread({}, props, {
        target: this.svgWrapper
      }), function (newState) {
        return _this.setProps(newState);
      });
      this.axisX = new _axisX.AxisX(_objectSpread({}, props, {
        target: this.svgWrapper
      }), function (newState) {
        return _this.setProps(newState);
      });
      this.axisY = new _axisY.AxisY(_objectSpread({}, props, {
        target: this.chartWrapper
      }), function (newState) {
        return _this.setProps(newState);
      });
      this.axisYright = new _axisY.AxisY(_objectSpread({}, props, {
        target: this.chartWrapper
      }), function (newState) {
        return _this.setProps(newState);
      }, true);
      this.tooltip = new _tooltip.Tooltip(_objectSpread({}, props, {
        target: this.chartWrapper
      }), function (newState) {
        return _this.setProps(newState);
      });
    }
  }, {
    key: "updatePosition",
    value: function updatePosition(props) {
      this.svgWrapper.style.transform = "translateX(".concat(-props.left + 16, "px) translate3d(0,0,0)");
    }
  }, {
    key: "update",
    value: function update(newProps) {
      if (newProps.lines.length === newProps.hiddenLines.length) {
        this.message.classList.add('--on');
      } else {
        this.message.classList.remove('--on');
      }

      this.axisYright.update(newProps);
      this.axisY.update(newProps);
      this.lines.update(newProps);
      this.tooltip.update(newProps);
      this.axisX.update(newProps);
      this.updatePosition(newProps);
    }
  }, {
    key: "init",
    value: function init(newProps) {
      this.chartWrapper.style.height = "".concat(newProps.chartHeight + 35, "px");

      if (newProps.percentage) {
        this.chartWrapper.style.marginTop = '15px';
      }

      this.axisY.init(newProps);
      this.axisYright.init(newProps);
      this.lines.init(newProps);
      this.tooltip.init(newProps);
      this.axisX.init(newProps);
      this.updatePosition(newProps);
    }
  }]);

  return ChartWrapper;
}();

exports.ChartWrapper = ChartWrapper;
},{"./helpers":"helpers.js","./axis-x":"axis-x.js","./axis-y":"axis-y.js","./lines":"lines.js","./tooltip":"tooltip.js"}],"chart.js":[function(require,module,exports) {
"use strict";

var _helpers = require("./helpers");

var _header = require("./header");

var _loading = require("./loading");

var _switchers = require("./switchers");

var _navigator = require("./navigator");

var _chartWrapper = require("./chart-wrapper");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var STYLES = "\n    .chart{\n        overflow: hidden;\n        font-family: 'Open Sans', sans-serif;\n        padding: 0 16px;\n        color: #000;\n        display: flex;\n        flex-direction: column;\n        position: relative;\n        -webkit-tap-highlight-color: rgba(0,0,0,0);\n        -webkit-tap-highlight-color: transparent;\n    }\n    .chart.--night {\n        color: #fff;\n    }\n";

var SimpleChart =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(SimpleChart, _HTMLElement);

  function SimpleChart() {
    var _this;

    _classCallCheck(this, SimpleChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SimpleChart).call(this));
    _this.state = {
      isZoomed: false,
      timeLine: [],
      startRange: 80,
      endRange: 100,
      chartIndent: 16,
      isLoading: true,
      lines: [],
      hiddenLines: [],
      daysLabels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      monthsLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    _this.shadow = _this.attachShadow({
      mode: 'open'
    });

    _helpers.DomHelper.style(_this.shadow, STYLES);

    _this.chart = _helpers.DomHelper.div('chart', _this.shadow);

    _this.render();

    return _this;
  }

  _createClass(SimpleChart, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      this.header = new _header.Header(_objectSpread({
        shadow: this.shadow,
        target: this.chart
      }, this.state), function (newState) {
        return _this2.setState(newState);
      });
      this.chartWrapper = new _chartWrapper.ChartWrapper(_objectSpread({
        shadow: this.shadow,
        target: this.chart
      }, this.state), function (newState) {
        return _this2.setState(newState);
      });
      this.navigator = new _navigator.Navigator(_objectSpread({
        shadow: this.shadow,
        target: this.chart
      }, this.state), function (newState) {
        return _this2.setState(newState);
      });
      this.switchers = new _switchers.Switchers(_objectSpread({
        shadow: this.shadow,
        target: this.chart
      }, this.state), function (newState) {
        return _this2.setState(newState);
      });
      this.loading = new _loading.Loading(_objectSpread({
        shadow: this.shadow,
        target: this.chart
      }, this.state), function (newState) {
        return _this2.setState(newState);
      });
    }
  }, {
    key: "createCache",
    value: function createCache() {
      var _this3 = this;

      if (this.state.maxCache) {
        return;
      }

      this.state.maxCache = {};
      this.state.lines.forEach(function (line) {
        var mapped = line.column.map(function (val, i) {
          return {
            val: val,
            i: i
          };
        });
        mapped.sort(function (a, b) {
          return b.val - a.val;
        });
        _this3.state.maxCache[line.id] = mapped;
      });
    }
  }, {
    key: "calculate",
    value: function calculate() {
      var _this4 = this;

      if (this.state.percentage || this.state.stacked) {
        if (!this.allColumnDataCache) {
          this.allColumnDataCache = {};
        }

        var key = "key".concat(this.state.hiddenLines.sort().join(''));

        if (!this.allColumnDataCache[key]) {
          var allColumnData = [];
          this.state.lines.forEach(function (line) {
            if (_this4.state.hiddenLines.indexOf(line.id) === -1) {
              for (var i = 0; i < line.column.length; i += 1) {
                if (!allColumnData[i]) {
                  allColumnData[i] = line.column[i];
                } else {
                  allColumnData[i] += line.column[i];
                }
              }
            }
          });
          this.allColumnDataCache[key] = allColumnData;
        }

        this.state.allColumnData = this.allColumnDataCache[key];
      }

      var startIndex = Math.floor(this.state.timeLine.length * this.state.startRange / 100);
      var endIndex = Math.ceil(this.state.timeLine.length * this.state.endRange / 100);
      var rangeMaxY = 0;
      var allMaxY = [];
      var yScaledRangeMaxY = 0;
      var yScaledAllMaxY = 0;

      if (this.state.stacked) {
        allMaxY = 0;

        for (var i = 0; i < this.state.allColumnData.length; i += 1) {
          if (i >= startIndex && i <= endIndex && this.state.allColumnData[i] > rangeMaxY) {
            rangeMaxY = this.state.allColumnData[i];
          }

          if (this.state.allColumnData[i] > allMaxY) {
            allMaxY = this.state.allColumnData[i];
          }
        }
      } else {
        this.state.lines.forEach(function (line, index) {
          if (_this4.state.hiddenLines.indexOf(line.id) === -1) {
            var maxCacheLine = _this4.state.maxCache[line.id];

            if (_this4.state.yScaled && index === _this4.state.lines.length - 1) {
              yScaledAllMaxY = maxCacheLine[0].val;

              for (var _i = 0; _i < maxCacheLine.length; _i += 1) {
                var item = maxCacheLine[_i];

                if (item.i >= startIndex && item.i <= endIndex) {
                  yScaledRangeMaxY = item.val;
                  break;
                }
              }

              return;
            }

            allMaxY.push(maxCacheLine[0].val);

            for (var _i2 = 0; _i2 < maxCacheLine.length; _i2 += 1) {
              var _item = maxCacheLine[_i2];

              if (_item.val < rangeMaxY) {
                break;
              }

              if (_item.i >= startIndex && _item.i <= endIndex && rangeMaxY < _item.val) {
                rangeMaxY = _item.val;
              }
            }
          }
        });
      }

      if (this.state.percentage) {
        this.state.rangeMaxY = 1;
        this.state.allMaxY = 1;
      } else if (this.state.stacked) {
        this.state.rangeMaxY = rangeMaxY;
        this.state.allMaxY = allMaxY;
      } else {
        this.state.rangeMaxY = rangeMaxY;
        this.state.allMaxY = Math.max.apply(Math, _toConsumableArray(allMaxY));
      }

      this.state.yScaledRangeMaxY = yScaledRangeMaxY;
      this.state.yScaledAllMaxY = yScaledAllMaxY;
    }
  }, {
    key: "update",
    value: function update(newState) {
      var _this5 = this;

      var prevHiddenLines = this.state.hiddenLines;
      this.state = _objectSpread({}, this.state, newState);

      if (!this.inited) {
        return;
      }

      this.createCache();
      this.calculate();

      if ((this.state.percentage || this.state.stacked) && prevHiddenLines.length !== this.state.hiddenLines.length || this.state.zoomInit) {
        this.prevColumnsData = [];
        this.state.lines = this.state.lines.map(function (line) {
          if (_this5.state.hiddenLines.indexOf(line.id) === -1) {
            return _objectSpread({}, line, _this5.generatePath(_this5.state, line));
          }

          return line;
        });
      }

      this.header.update(this.state);
      this.chartWrapper.update(this.state);
      this.navigator.update(this.state);
      this.switchers.update(this.state);
      this.loading.update(this.state);
      this.state.zoomInit = false;
    }
  }, {
    key: "init",
    value: function init(newState) {
      var _this6 = this;

      this.state = _objectSpread({}, this.state, newState);
      this.createCache();
      this.calculate();
      this.prevColumnsData = [];
      this.state.lines = this.state.lines.map(function (line) {
        return _objectSpread({}, line, _this6.generatePath(_this6.state, line));
      });
      this.header.init(this.state);
      this.chartWrapper.init(this.state);
      this.navigator.init(this.state);
      this.switchers.init(this.state);
      this.loading.init(this.state);
      this.inited = true;
    }
  }, {
    key: "setState",
    value: function setState(newState) {
      var _this7 = this;

      if (this.state.isZoomed && newState.isZoomed === false) {
        this.prevState.hideNavigator = this.state.hideNavigator;

        if (!this.prevState.hideNavigator) {
          this.prevState.hiddenLines = this.state.hiddenLines;
        }

        this.state = _objectSpread({}, this.prevState);
        this.state.zoomedIndex = null;
        this.state.isLoading = false;
        this.allColumnDataCache = _objectSpread({}, this.prevAllColumnDataCache);
        this.state.hideNavigator = false;
        this.state.isZoomed = false;
        this.state.zoomInit = true;
      }

      if (!this.state.isZoomed && newState.zoomedIndex && !this.state.percentage) {
        var zoomedDate = new Date(this.state.timeLine[newState.zoomedIndex]);
        var url = this.state.dataUrl;
        url += "/".concat(zoomedDate.getFullYear(), "-");
        url += "".concat(zoomedDate.getMonth() > 8 ? zoomedDate.getMonth() + 1 : "0".concat(zoomedDate.getMonth() + 1));
        url += "/".concat(zoomedDate.getDate() > 9 ? zoomedDate.getDate() : "0".concat(zoomedDate.getDate()), ".json");
        fetch(url).then(function (response) {
          return response.json();
        }).then(function (data) {
          _this7.prevState = _objectSpread({}, _this7.state);
          _this7.prevAllColumnDataCache = _objectSpread({}, _this7.allColumnDataCache);
          _this7.allColumnDataCache = null;
          var newZoomedState = {
            maxCache: null,
            zoomInit: true,
            isZoomed: true,
            startRange: 100 / 7 * 3 - 6 * 100 / _this7.state.width,
            endRange: 100 / 7 * 4 - 8 * 100 / _this7.state.width,
            chartIndent: 16,
            isLoading: false,
            hiddenLines: _this7.state.hiddenLines,
            lines: [],
            width: _this7.state.width,
            height: _this7.state.height,
            yScaled: data.y_scaled,
            percentage: data.percentage,
            stacked: data.stacked,
            title: _this7.state.title,
            hoveredIndex: null
          };
          data.columns.forEach(function (column) {
            if (column[0] === 'x') {
              newZoomedState.timeLine = column;
              newZoomedState.timeLine.shift();
            } else {
              var id = newZoomedState.lines.length;
              newZoomedState.lines.push({
                id: column[0],
                color: data.colors[column[0]],
                name: data.names[column[0]],
                column: column,
                type: data.types[column[0]]
              });
              newZoomedState.lines[id].column.shift();
            }
          });
          newZoomedState.hideNavigator = _this7.prevState.lines.length !== newZoomedState.lines.length;

          if (newZoomedState.hideNavigator) {
            newZoomedState.endRange = 100;
            newZoomedState.startRange = 0;
          }

          newZoomedState.scaleRange = (newZoomedState.endRange - newZoomedState.startRange) / 100;
          newZoomedState.chartWidth = newZoomedState.width / newZoomedState.scaleRange;
          newZoomedState.chartHeight = newZoomedState.height;
          newZoomedState.left = newZoomedState.chartWidth * newZoomedState.startRange / 100;

          _this7.update(newZoomedState);
        }); // eslint-disable-next-line no-param-reassign

        newState.isLoading = true;
      }

      this.update(newState);
    }
  }, {
    key: "generatePath",
    value: function generatePath(state, line) {
      var scaleX;

      if (line.type === 'bar') {
        scaleX = state.width / state.timeLine.length;
      } else {
        scaleX = state.width / (state.timeLine.length - 1);
      }

      var fixScaleY = 1;

      if (!(state.percentage || state.stacked)) {
        if (line.column[0] > 1000000) {
          fixScaleY = 1000000;
        } else if (line.column[0] > 1000) {
          fixScaleY = 1000;
        }
      }

      var value = line.column[0] / fixScaleY;

      if (state.percentage) {
        value = line.column[0] / state.allColumnData[0];
      }

      if (state.stacked && this.prevColumnsData[0]) {
        value += this.prevColumnsData[0];
      }

      this.prevColumnsData[0] = value;
      var path = '';

      if (line.type === 'area') {
        path = "M0 0 L 0 ".concat(value);
      } else if (line.type === 'bar') {
        path = "M0 0 L 0 ".concat(value);
      } else {
        path = "M0 ".concat(value);
      }

      for (var i = 1; i < line.column.length; i += 1) {
        value = line.column[i] / fixScaleY;

        if (state.percentage) {
          value = line.column[i] / state.allColumnData[i];
        }

        if (state.stacked && this.prevColumnsData[i]) {
          value += this.prevColumnsData[i];
        }

        this.prevColumnsData[i] = value;

        if (line.type === 'bar') {
          path += " L ".concat(i * scaleX, " ").concat(this.prevColumnsData[i - 1], " L ").concat(i * scaleX, " ").concat(value);
        } else {
          path += " L ".concat(i * scaleX, " ").concat(value);
        }
      }

      if (line.type === 'area' || line.type === 'bar') {
        path += " L ".concat(line.column.length * scaleX, " ").concat(value);
        path += " L ".concat(line.column.length * scaleX, " 0");
      }

      return {
        path: path,
        fixScaleY: fixScaleY
      };
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'is-night') {
        if (newValue === 'true') {
          this.chart.classList.add('--night');
        } else {
          this.chart.classList.remove('--night');
        }

        this.state.isNight = newValue === 'true';
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this8 = this;

      var dataUrl = this.getAttribute('url');
      var width = parseInt(this.getAttribute('width'), 10);
      var height = parseInt(this.getAttribute('height'), 10);
      var title = this.getAttribute('title');
      var isNight = this.getAttribute('is-night') === 'true';
      fetch("".concat(dataUrl, "/overview.json")).then(function (response) {
        return response.json();
      }).then(function (data) {
        var newState = {
          lines: [],
          dataUrl: dataUrl,
          width: width - _this8.state.chartIndent * 2,
          height: height,
          yScaled: data.y_scaled,
          percentage: data.percentage,
          stacked: data.stacked,
          title: title,
          isNight: isNight
        };
        data.columns.forEach(function (column) {
          if (column[0] === 'x') {
            newState.timeLine = column;
            newState.timeLine.shift();
          } else {
            var id = newState.lines.length;
            newState.lines.push({
              id: column[0],
              color: data.colors[column[0]],
              name: data.names[column[0]],
              column: column,
              type: data.types[column[0]]
            });
            newState.lines[id].column.shift();
          }
        });
        newState.scaleRange = (_this8.state.endRange - _this8.state.startRange) / 100;
        newState.chartWidth = newState.width / newState.scaleRange;
        newState.chartHeight = newState.height;
        newState.left = newState.chartWidth * _this8.state.startRange / 100;

        _this8.init(_objectSpread({}, newState, {
          isLoading: false
        }));
      });
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['is-night'];
    }
  }]);

  return SimpleChart;
}(_wrapNativeSuper(HTMLElement));

customElements.define('simple-chart', SimpleChart);
},{"./helpers":"helpers.js","./header":"header.js","./loading":"loading.js","./switchers":"switchers.js","./navigator":"navigator.js","./chart-wrapper":"chart-wrapper.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53512" + '/');

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
      } else {
        window.location.reload();
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","chart.js"], null)
//# sourceMappingURL=/chart.776f2112.js.map