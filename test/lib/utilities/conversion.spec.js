
import { camelToHyphenate } from '../../..';
import { camelToUnderscore } from '../../..';
import { hyphenateToCamel } from '../../..';
import { hyphenateToUnderscore } from '../../..';
import { underscoreToCamel } from '../../..';
import { underscoreToHyphenate } from '../../..';
import { parseJSON } from '../../..';
import { num2en } from '../../..';
import { num2cn } from '../../..';

describe('Is the conversions correct?', () => {

  it('The parse function do not throw an exception.', () => {
    expect(parseJSON('{"name": "phusis"}').name).toBe('phusis');
    expect(parseJSON('hello, world')).toBeNull;
  });

  it('Varible name is converting.', () => {
    const varNameCamel = 'itIsAVaribleName';
    const varNameHyphenate = 'it-is-a-varible-name';
    const varNameUnderscore = 'it_is_a_varible_name';
    expect(camelToHyphenate(varNameCamel)).toEqual(varNameHyphenate);
    expect(camelToUnderscore(varNameCamel)).toEqual(varNameUnderscore);
    expect(hyphenateToCamel(varNameHyphenate)).toEqual(varNameCamel);
    expect(hyphenateToUnderscore(varNameHyphenate)).toEqual(varNameUnderscore);
    expect(underscoreToCamel(varNameUnderscore)).toEqual(varNameCamel);
    expect(underscoreToHyphenate(varNameUnderscore)).toEqual(varNameHyphenate);
  });

  it('Numbers is converting.', () => {
    const num1 = 11865438357, num2 = 1, num3 = 40000000, num4 = 563.1113, num5 = 1030007;
    const en1 = 'eleven billion, eight hundred and sixty-five million, four hundred and thirty-eight thousand, three hundred and fifty-seven',
      cn1 = '一百一十八亿六千五百四十三万八千三百五十七',
      cn1t = '壹佰壹拾捌亿陆仟伍佰肆拾叁万捌仟叁佰伍拾柒';
    const en2 = 'one', cn2 = '一', cn2t = '壹';
    const en3 = 'forty million', cn3 = '四千万', cn3t = '肆仟万';
    const en4 = 'five hundred and sixty-three point one one one three',
      cn4 = '五百六十三点一一一三', cn4t = '伍佰陆拾叁点壹壹壹叁';
    const en5 = 'one million, thirty thousand, seven', cn5 = '一百零三万零七', cn5t = '壹佰零叁万零柒';
    expect(num2en(num1)).toEqual(en1);
    expect(num2cn(num1)).toEqual(cn1);
    expect(num2cn(num1, true)).toEqual(cn1t);
    expect(num2en(num2)).toEqual(en2);
    expect(num2cn(num2)).toEqual(cn2);
    expect(num2cn(num2, true)).toEqual(cn2t);
    expect(num2en(num3)).toEqual(en3);
    expect(num2cn(num3)).toEqual(cn3);
    expect(num2cn(num3, true)).toEqual(cn3t);
    expect(num2en(num4)).toEqual(en4);
    expect(num2cn(num4)).toEqual(cn4);
    expect(num2cn(num4, true)).toEqual(cn4t);
    expect(num2en(num5)).toEqual(en5);
    expect(num2cn(num5)).toEqual(cn5);
    expect(num2cn(num5, true)).toEqual(cn5t);
  });

});




