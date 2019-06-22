
const __logger__ = null;

const polyfills = (function () {

  if (!Date.prototype.getStamp) {
    /**
    * 以秒为单位的时间戳，即Math.floor(date.getTime() / 1000)
    * @author lennon
    * @return Number 时间戳
    **/
    Date.prototype.getStamp = function () {
      return Math.floor(this.getTime() / 1000);
    };
  }
  if (!Date.getCurrentStamp) {
    /**
    * 以秒为单位的时间戳，即Math.floor(date.getTime() / 1000)
    * @author lennon
    * @return Number 时间戳
    **/
    Date.getCurrentStamp = function () {
      return new Date().getStamp();
    }
  }

  const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
  const arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];// 校验码
  const cnNewIDRegExp = /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/i;
  if (!String.prototype.isCnNewID) {
    /**
    * 检验18位身份证号码（15位号码可以只检测生日是否正确即可）
    * @author lennon
    * @return Boolean 是否合法
    **/
    String.prototype.isCnNewID = function () {
      if (cnNewIDRegExp.test(this)) {
        let sum = 0, idx = 0;
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
    }
  }

  if (!Array.prototype.toTree) {
    /**
    * 表式数据生成树状数据方法生成的委托方法
    * @author lennon
    * @param options.id String，id字段的字段名
    * @param options.parent String，parent字段的字段名
    * @param options.children String，children字段的字段名
    * @return Function，返回 toTree(table) 方法
    **/
    Array.prototype.toTree = function (options) {
      const opts = {
        id: 'id',
        parent: 'parent_id',
        children: 'children',
        ...options
      };
      const tree = [];
      const walk = treeWalker(opts);
      const table = [...this];
      while (table.length) {
        for (let idx = table.length - 1; idx >= 0; idx--) {
          const row = table[idx];
          if (row[opts.parent] == null || row[opts.parent] === '' || row[opts.parent] == 0 || row[opts.parent] == false) {
            tree.push({ ...row, [opts.children]: [] });
            table.splice(idx, 1);
          } else {
            const ps = walk(tree, (node) => {
              return row[opts.parent] === node[opts.id];
            });
            if (ps) {
              ps[opts.children] = ps[opts.children] || [];
              ps[opts.children].push({ ...row });
              table.splice(idx, 1);
            }
          }
        }
      }
      return tree;
    }
  }
  function treeWalker(options) {
    const o = {
      children: 'children',
      ...options
    };
    return function walk(tr, fn) {
      let n = null;
      if (tr && tr.length) {
        for (const [, t] of tr.entries()) {
          if (fn(t)) {
            n = t;
            break;
          } else {
            n = walk(t[o.children], fn);
            if (n) {
              break;
            }
          }
        }
      }
      return n;
    };
  }

  function Exception(message) {
    this.message = message;
    this.type = 'customer';
    this.name = 'CustomerError';
    this.code = 9999;
    this.innerError = this;
  }
  Exception.prototype = new Error();
  Exception.prototype.log = function (logger) {
    logger = logger || this.logger || console;
    logger.error(`[!EXCEPTION] - [${this.type}] -> ${this.name || this.message} (Code:${this.code})<----`);
    this.fileName && logger.error(`\t [line ${this.lineNumber}, col ${this.columnNumber}] - ${this.fileName}`);
    this.name && logger.error(`\t [message] - ${this.message}`);
    logger.error(`\t ${this.stack || this.innerError.stack}`);
    logger.error(`\t --------------------------------------------------`);
  }

  function _caught(err) {
    if (err instanceof Exception) {
      return err;
    }
    const wrapper = new Exception();
    if (!err || typeof err === 'string') {
      wrapper.message = err || 'undefined error!';
    } else if (err instanceof Error) {
      const { message, code, type, name, stack, number } = err;
      wrapper.code = typeof code === 'number' ? code : (typeof number === 'number' ? number : wrapper.code);
      wrapper.message = `(Code:${wrapper.code})${message}`;
      wrapper.type = type || wrapper.type;
      wrapper.name = name || wrapper.name;
      wrapper.stack = stack;
    }
    wrapper.innerError = err;
    return wrapper;
  }

  return {
    date_getStamp: Date.prototype.getStamp,
    getCurrentStamp: Date.getCurrentStamp,
    string_isCnNewID: String.prototype.isCnNewID,
    array_toTree: Array.prototype.toTree,
    caught: _caught,
    errlog: function (err, logger) {
      if (err instanceof Exception) {
        err.log(logger || __logger__);
      } else {
        _caught(err).log(logger || __logger__);
      }
    }
  }

})();

exports.polyfills = polyfills;
exports.caught = polyfills.caught;
exports.errlog = polyfills.errlog;
exports.setLogger = function (logger) { 
  __logger__ = logger;
};
