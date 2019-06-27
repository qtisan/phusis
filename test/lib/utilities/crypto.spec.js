import { encrypt } from "../../..";
import { decrypt } from "../../..";
import { md5 } from "../../..";

describe('Is crypto functions works correct?', () => {
  const originCode = 'Password1234!@#$'
  const encryptedCode = '=yM4IyMyIyNtb2VyYWVfYXBwX2NpcGhlcg=I.rE-lH1xhHZ79BABUCrQARQ';
  const md5Code = 'caecb26de1c989826750c7c478a9401d';

  const originEase = '123';
  const encryptedEase = '=yM2IyMyIyNtb2VyYWVfYXBwX2NpcGhlcg=I.QmXIBm';

  it('should the encrypt be right!', () => {
    expect(encrypt(originCode)).toEqual(encryptedCode);
    expect(decrypt(encryptedCode)).toEqual(originCode);
    expect(encrypt(originEase)).toEqual(encryptedEase);
    expect(decrypt(encryptedEase)).toEqual(originEase);
  });

  it('should the md5 function right?', () => {
    expect(md5(originCode)).toEqual(md5Code);
  });

});