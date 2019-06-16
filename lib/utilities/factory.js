
/**
* 序列码、流水号生成方法
* @author lennon
* @param pre String 用于区分类别的前缀
* @return String 生成的序列码
**/
export const genSerial = (pre) => {
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

