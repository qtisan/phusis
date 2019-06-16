import { genSerial } from "../../..";

describe('Here should be A functionality factory.', () => {

  it('generate a serial number as expected.', () => {
    const serials = [];
    for (let i = 0; i < 10000; i++) {
      const sn = genSerial();
      expect(serials).not.toContain(sn);
    }
  });

});