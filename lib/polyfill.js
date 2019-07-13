const moment = require('moment');

const polyfills = (function() {
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
      value: function assign(target, varArgs) {
        // .length of function is 2
        'use strict';
        if (target == null) {
          // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        let to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) {
            // Skip over if undefined or null
            for (let nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }
  if (!Date.prototype.getStamp) {
    /**
     * 以秒为单位的时间戳，即Math.floor(date.getTime() / 1000)
     * @author lennon
     * @return Number 时间戳
     **/
    Date.prototype.getStamp = function() {
      return Math.floor(this.getTime() / 1000);
    };
  }
  if (!Date.getCurrentStamp) {
    /**
     * 以秒为单位的时间戳，即Math.floor(date.getTime() / 1000)
     * @author lennon
     * @return Number 时间戳
     **/
    Date.getCurrentStamp = function() {
      return new Date().getStamp();
    };
  }
  if (!Date.moment) {
    Date.moment = moment;
  }

  const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
  const arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; // 校验码
  const cnNewIDRegExp = /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/i;
  if (!String.prototype.isCnNewID) {
    /**
     * 检验18位身份证号码（15位号码可以只检测生日是否正确即可）
     * @author lennon
     * @return Boolean 是否合法
     **/
    String.prototype.isCnNewID = function() {
      if (cnNewIDRegExp.test(this)) {
        let sum = 0,
          idx = 0;
        for (let i = 0; i < this.length - 1; i++) {
          // 对前17位数字与权值乘积求和
          sum += parseInt(this.substr(i, 1), 10) * arrExp[i];
        }
        // 计算模（固定算法）
        idx = sum % 11;
        // 检验第18为是否与校验码相等
        // eslint-disable-next-line eqeqeq
        return arrValid[idx] == this.substr(17, 1).toUpperCase();
      } else {
        return false;
      }
    };
  }

  return {
    date_getStamp: Date.prototype.getStamp,
    getCurrentStamp: Date.getCurrentStamp,
    string_isCnNewID: String.prototype.isCnNewID
  };
})();

exports.polyfills = polyfills;
