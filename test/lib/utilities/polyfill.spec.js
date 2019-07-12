import '../../..';
import { caught } from '../../..';

describe('Would these be the build-in functions?', () => {
  it('Date.prototype.getStamp()', () => {
    const d = new Date('2008-8-8');
    expect(d.getStamp()).toEqual(1218124800);
  });

  it('String.prototype.isCnNewID()', () => {
    const str = '189473',
      newid = '330382198608110018';
    expect(str.isCnNewID()).not.toBeTruthy();
    expect(newid.isCnNewID()).toBeTruthy();
  });

  it('caught()', () => {
    const error = new Error('I am an error!');
    const newError = caught('I hide the real error!');
    const newEntireError = caught(error, 'I DID hide the real error!', 109);
    expect(newError instanceof Error).toBeTruthy();
    expect(newEntireError).toMatchSnapshot();
    // newEntireError.log();
  });
});
