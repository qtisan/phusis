import { caught, isError, isException } from '../../..';

describe('exception would be ok', () => {
  it('caught()', () => {
    const error = new Error('I am an error!');
    const newError = caught('I hide the real error!');
    const newEntireError = caught(error, 'I DID hide the real error!', 109);
    expect(newError instanceof Error).toBeTruthy();
    expect(newEntireError).toMatchSnapshot();

    expect(isError(error)).toBeTruthy();
    expect(isError(newError)).toBeFalsy();
    expect(isException(newEntireError)).toBeTruthy();
    expect(isException(error)).toBeFalsy();
  });
});
