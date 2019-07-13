import { sleep } from "../../..";

describe('System extentions.', () => {

  it('would it get sleep from seconds.', async () => {
    const start = new Date().getTime();
    await sleep(1500);
    const end = new Date().getTime();
    expect(end - start).toBeGreaterThanOrEqual(1500);
  });

});