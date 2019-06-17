
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const { ObjectID } = require('bson');
const { encodeByMap } = require('./crypto');

/**
* 序列码、流水号生成方法
* @author lennon
* @param pre String 用于区分类别的前缀
* @return String 生成的序列码
**/
exports.genSerial = (pre) => {
  pre = pre || '';
  let d = (new Date()).getTime().toString(),
    i = Math.floor(Math.random() * 10),
    l = d.length;
  if (l < 15) {
    let x = 15 - l;
    while (x-- > 0) d += '0';
  }
  return pre +
    Math.random().toString().slice(2, 8) +
    d.slice(0, i) +
    Math.random().toString().slice(5, 10) +
    d.slice(i) +
    Math.random().toString().slice(9, 14) + i;
};

exports.genUUID = (type, param) => {
  type = type || 'timestamp';
  switch (type) {
    case 'timestamp':
      return uuidv1();
    case 'namespace':
      param = param || 'http://phusis.imqx.com';
      return uuidv5(param, uuidv5.URL);
    case 'random':
      return uuidv4();
    default:
      return uuidv1();
  }
}

/** 
* 生成唯一ID，bson中ObjectID的简化版，19位 
* @author lennon 
* @return String ID码 
**/
exports.genId = () => encodeByMap(new ObjectID().toString(), {
  cipher: null,
  mixed: s => s.substr(1)
});

