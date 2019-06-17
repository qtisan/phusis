import { genSerial } from "../../..";
import { genUUID } from "../../..";
import { genId } from "../../..";

describe('Here should be A functionality factory.', () => {

  it('generate a serial number as expected.', () => {
    const serials = [];
    for (let i = 0; i < 10000; i++) {
      const sn = genSerial();
      expect(serials).not.toContain(sn);
    }
  });

  it('generate a uuid.', () => {
    const url = 'http://www.sample.com';
    expect(genUUID()).toBeTruthy();
    expect(genUUID('timestamp')).toBeTruthy();
    expect(genUUID('random')).toBeTruthy();
    expect(genUUID('namespace', url)).toEqual('fe5261b9-9d9e-524a-95e2-0469e6f8030b');
  });

  it('generate a 19 bytes id.', () => {
    const ids = [];
    for (let i = 0; i < 10000; i++) {
      const id = genId();
      expect(ids).not.toContain(id);
    }
  });
  
});