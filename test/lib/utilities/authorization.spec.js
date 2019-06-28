
import { makeEncryptedQuery, extractCredential } from "../../../src/main";


it('shoud the query process be ok!', () => {
  const token = 'fe5261b9-9d9e-524a-95e2-0469e6f8030b';
  const query = {
    action: 'post',
    payload: {
      where: {
        OR: [
          {
            title_contains: 'graphql',
          },
          {
            title_contains: 'prisma',
          },
        ],
        createdAt_gt: '2018',
        createdAt_lt: '2020',
      },
    }
  };
  const { credential, encryptedQuery } = makeEncryptedQuery(token, query);
  const { token, key, timestamp } = extractCredential(credential);

});

