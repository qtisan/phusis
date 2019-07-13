/**
* 解析JSON方法，防止Error抛出，无效则返回null
* @author lennon
* @param str String，需要解析的JSON字符串
* @return Object 解析后的对象
**/
exports.parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
};

/**
* 驼峰式命名法转换为连字符命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
exports.camelToHyphenate = (name) => {
  return parseCamel(name).join('-');
};

/**
* 连字符命名法转换为驼峰式命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
exports.hyphenateToCamel = (name) => {
  return parseConnector(name, '-');
};

/**
* 下划线命名法转换为驼峰式命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
exports.underscoreToCamel = (name) => {
  return parseConnector(name, '_');
};

/**
* 驼峰式命名法转换为下划线命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
exports.camelToUnderscore = (name) => {
  return parseCamel(name).join('_');
};

/**
* 连字符命名法转换为下划线命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
exports.hyphenateToUnderscore = (name) => {
  return name.split('-').join('_');
};

/**
* 下划线命名法转换为连字符命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
exports.underscoreToHyphenate = (name) => {
  return name.split('_').join('-');
};

function parseCamel(name) {
  const result = []; let start = 0;
  name += 'A';
  for (let i = 0; i < name.length; i++) {
    if (name[i].toLowerCase() !== name[i] || i === name.length - 1) {
      result.push(name.substring(start, i).toLowerCase());
      start = i;
    }
  }
  return result;
}

function parseConnector(name, connector) {
  const result = name.split(connector);
  for (let i = 0; i < result.length; i++) {
    if (i !== 0) {
      const v = result[i];
      result[i] = v[0].toUpperCase() + v.slice(1);
    }
  }
  return result.join('');
}


const A = ('zero^one^two^three^four^five^six^seven^eight^nine^ten' +
  '^eleven^twelve^thirteen^fourteen^fifteen^sixteen^seventeen^eighteen^nineteen^' +
  '^twenty^thirty^forty^fifty^sixty^seventy^eighty^ninety^hundred^' +
  '^thousand^million^billion^trillion^quadrillion^quintillion').split('^'),
  B = [];
for (let i = 0; i < 1000; i++) {
  B[i] = i < 20 ? A[i] :
    i < 100 ?
      A[19 + Math.floor(i / 10)] + (i % 10 == 0 ? "" : "-" + B[i % 10])
      :
      A[Math.floor(i / 100)] + " " + A[29] + (i % 100 == 0 ? "" : " and " + B[i % 100]);
}
const S = ['', '十', '百', '千', '万', '亿', '点', ''],
  R = ['', '拾', '佰', '仟', '万', '亿', '点', ''],
  X = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
  Y = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];

/**
* 数字转换为英文表述
* @author lennon
* @param num number，数字的值
* @return String 转换后的英文表述
**/
exports.num2en = (num) => {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    return 'Number is wrong!';
  }
  const numInt = num.toString().split('.')[0].split(',').join('');
  let sec, text = '';
  for (let i = 0; i < Math.ceil(numInt.length / 3); i++) {
    sec = parseInt(
      numInt.substring(
        numInt.length - 3 * i - 3,
        numInt.length - 3 * i
      ),
      10
    );
    text = (i == 0 && sec > 0 && sec < 100 && parseInt(numInt.substring(0, length - 3), 10) > 0 ? ' and ' : '') +
      (sec == 0 && (i > 0 || numInt.toString(10) != 0) ? '' : B[sec]) +
      (sec == 0 ? '' : ' ' + (typeof A[30 + i] == 'undefined' ? 'undefined' : A[30 + i])) +
      (i == 0 || sec == 0 || (sec > 0 && text == '') ? '' : ', ') + text;
  }
  if (num.toString().split('.')[1]) {
    let numFloat = num.toString().split('.')[1].split(',').join('');
    for (let i = 0; i < numFloat.length; i++) {
      sec = parseInt(numFloat.substring(i, i + 1), 10);
      text += (i == 0 ? (text == '' ? A[0] : '') + 'point ' : '') +
        (sec == 0 && i != 0 && !parseInt(numFloat.substring(i + 1), 10) > 0 ? '' : B[sec] + ' ');
    }
  }
  return text.trim();
};
/**
* 数字转换为中文文表述
* @author lennon
* @param num number，数字的值
* @param f boolean?，是否为金额大写中文，不传递则为一、二、三...
* @return String 转换后的中文表述
**/
exports.num2cn = (num, f) => {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    return 'Number is wrong!';
  }
  const AA = f ? Y : X,
    BB = f ? [...R] : [...S];
  const a = num.toString().replace(/(^0*)/g, '').split('.');
  let k = 0, re = '', ss = a[0];
  for (let i = ss.length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp('0{4}\\d{' + (ss.length - i - 1) + '}$').test(ss)) {
          re = BB[4] + re;
        }
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 == 2 && ss[i + 2] != 0 && ss[i + 1] == 0) {
      re = AA[0] + re;
    }
    if (ss[i] != 0) {
      re = AA[ss[i]] + BB[k % 4] + re;
    }
    k++;
  }
  if (a.length > 1) {
    re += BB[6];
    for (let j = 0; j < a[1].length; j++) {
      re += AA[a[1][j]];
    }
  }
  return re;
};

/**
* 表式数据生成树状数据方法生成的委托方法
* @author lennon
* @param options.id String，id字段的字段名
* @param options.parent String，parent字段的字段名
* @param options.children String，children字段的字段名
* @return Array，返回 tree
**/
exports.list2Tree = (list, options) => {
  const opts = {
    id: 'id',
    parent: 'parent_id',
    children: 'children',
    ...options
  };
  const tree = [];
  const walk = (function treeWalker(op) {
    const o = { ...op };
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
  })(opts);
  const table = [...list];
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
};

