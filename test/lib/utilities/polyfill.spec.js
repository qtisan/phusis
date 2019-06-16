import '../../..';

describe('Would these be the build-in functions?', () => {

  it('Array.prototype.toTree()', () => {
    const menus = [
      { id: '101', name: 'system', parent_id: '' },
      { id: '102', name: 'shutdown', parent_id: '101' },
      { id: '103', name: 'logout', parent_id: '101' },
      { id: '104', name: 'register', parent_id: '101' },
      { id: '105', name: 'work', parent_id: null },
      { id: '106', name: 'calendar', parent_id: '105' },
      { id: '107', name: 'events', parent_id: '105' },
      { id: '108', name: 'conference', parent_id: '107' },
      { id: '109', name: 'meetings', parent_id: '107' },
      { id: '110', name: 'talk', parent_id: '107' },
      { id: '111', name: 'native', parent_id: '110' },
      { id: '112', name: 'onboard', parent_id: '110' },
      { id: '113', name: 'about' }
    ];
    expect(menus.toTree()).toMatchSnapshot();
  });

  it('Date.prototype.getStamp()', () => { 
    const d = new Date('2008-8-8');
    expect(d.getStamp()).toEqual(1218124800);
  });

  it('String.prototype.isCnNewID()', () => {
    const str = '189473', newid = '330382198608110018';
    expect(str.isCnNewID()).not.toBeTruthy();
    expect(newid.isCnNewID()).toBeTruthy();
  });

  it('Error.prototype.wrap()', () => {
    const error = new Error('I am an error!');
    const newError = error.wrap('I hide the real error!');
    const newEntireError = error.wrap({ message: 'I DID hide the real error!', code: 109, type: 'sys' });
    expect(newError).toMatchSnapshot();
    expect(newEntireError).toMatchSnapshot();
    // newEntireError.log();
  });

});