'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory, GLOBAL) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory(GLOBAL, global) : typeof define === 'function' && define.amd ? define(factory(GLOBAL, global)) : global.requestUrl = factory(GLOBAL, global);
})(window, function (GLOBAL, global) {
  'use strict';
  /**
   * 仅内部使用（用户登陆后）
   */

  if ((typeof GLOBAL === 'undefined' ? 'undefined' : _typeof(GLOBAL)) !== 'object') {
    alert('上下文异常');return;
  }

  var confRoot = GLOBAL.confRoot || 'http://xxx.cn/'; //saas接口上下文

  return {};
}, GLOBAL);