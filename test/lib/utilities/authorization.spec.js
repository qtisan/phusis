
import {
  md5, signin, handleQuery,
  makeEncryptedQuery, 
} from "../../../src/main";

describe('shoud the query process be ok', () => {
  const serverTokenStore = {
    uid: null,
    tokens: {
      tokenKey: null, refreshKey: null, refreshExpire: null,
      tokens: {
        access_token: null,
        refresh_token: null,
        expire_at: null
      }
    }
  };
  const clientTokenStore = {
    access_token: null,
    refresh_token: null,
    expire_at: null
  };
  const username = 'lennon';
  const password_md5 = md5('Qwert!234@#$fk@_2RRgx');
  const user = {
    user_id: 'fe5261b9-9d9e-524a-95e2-0469e6f8030b',
    username, email: 'lennon@imqx.com', phone: '18668088038',
    permissions: ['USER', 'POST_MANAGER']
  };
  const verifyUser = (up) => a100(
    username === up.username && password_md5 === up.password_md5 && user
  );
  const saveTokens = (user_id, tokens) => a100(() => {
    serverTokenStore.uid = user_id;
    serverTokenStore.tokens = tokens;
    return true;
  });
  const saveClientTokens = (tokens) => {
    clientTokenStore.access_token = tokens.access_token;
    clientTokenStore.refresh_token = tokens.refresh_token;
    clientTokenStore.expire_at = tokens.expire_at;
  };
  const verifyToken = (token) => a100(() => {
    const current = Date.getCurrentStamp();
    if (serverTokenStore.tokens.tokens.access_token !== token) {
      throw new Error('token not match a user.');
    } else if (serverTokenStore.tokens.tokens.expire_at < current) {
      throw new Error('access_token expired, should to be refreshed.');
    } else if (serverTokenStore.tokens.refreshExpire < current) {
      throw new Error('refresh_token expired, should resignin.')
    } else if (serverTokenStore.uid !== user.user_id) {
      throw new Error('user not exist.');
    } else {
      return user;
    }
  });
  const query = {
    action: 'post',
    payload: {
      where: {
        OR: [
          { title_contains: 'graphql' },
          { title_contains: 'prisma' },
        ], createdAt_gt: '2018', createdAt_lt: '2020',
      },
    }
  };
  const resData = {
    data: [
      { id: '1', title: 'Graphql is a new technology for query.', create_at: '2019-01-03' },
      { id: '1', title: 'Prisma 2 Preview is now ready!.', create_at: '2019-05-22' }
    ],
    total: 9,
    offset: 0,
    limit: 2
  };
  const executeQuery = (payload) => a100(payload && resData);

  it('shoud sign be ok', async () => {
    const oup = await signin({ username, password_md5 }, verifyUser, saveTokens);
    expect(oup.user.user_id).toEqual(user.user_id);
    saveClientTokens(oup.tokens);
  });

  it('should query from client be ok', async () => {
    const { credential, q } = makeEncryptedQuery(clientTokenStore.access_token, query);
    const res = await handleQuery(credential, q, verifyToken, executeQuery);
    expect(res.data.length).toEqual(resData.data.length);
    expect(res.total).toEqual(resData.total);
  });

  it('should client access_token be expired', async () => {
    serverTokenStore.tokens.tokens.expire_at -= 30 * 60;
    const { credential, q } = makeEncryptedQuery(clientTokenStore.access_token, query);
    expect(handleQuery(credential, q, verifyToken, executeQuery))
      .rejects.toThrow(/access_token expired/);
  });

  it('shoud client refresh_token be expired', async () => {
    serverTokenStore.tokens.refreshExpire -= 10 * 24 * 60 * 60;
    const { credential, q } = makeEncryptedQuery(clientTokenStore.access_token, query);
    expect(handleQuery(credential, q, verifyToken, executeQuery))
      .rejects.toThrow(/refresh_token expired/);
  });

  it('shoud tokens be refreshed', async () => { 
    
  });

});

function a100(fn) {
  if (typeof fn === 'function') {
    return new Promise((resolve, reject) => setTimeout(() => {
      try {
        const res = fn();
        resolve(res);
      } catch (e) {
        reject(e);
      }
    }, 100));
  } else {
    return new Promise(resolve => setTimeout(() => resolve(fn), 100));
  } 
}