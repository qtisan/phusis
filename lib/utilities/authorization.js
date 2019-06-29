
require('./polyfill');
const querystring = require('querystring');
const { parseJSON } = require('./conversion');
const { encrypt, decrypt, defaultEncryptOptions, encodeByMap, decodeByMap } = require('./crypto');

const overrideCipher = Object.assign({}, defaultEncryptOptions, {
  cipher: 'ourea_auth_cipher',
  join: null
});
const encrypt2 = function (origin) {
  return encodeByMap(origin, overrideCipher);
};
const decrypt2 = function (code) {
  return decodeByMap(code, overrideCipher);
};

// 1. 客户端：发起登陆请求，带username, password_md5
//    服务端：验证用户信息后，makeTokens(uid)，保存结果与uid到登陆信息，
//           将tokes: { access_token, refresh_token, expire_at } 交给客户端
// 2. access_token 未过期时：
//    客户端：发起查询请求，makeEncryptedQuery(access_token, query)，将credential放入header，q放入post body
//    服务端：extractQuery(credential, q)，30秒之内的请求有效，得到 {token,key,query,timestamp}
//           查询access_token==token有结果，且token未过期，则使用uid权限执行query
// 3. access_token 过期时：
//    客户端：发起刷新token请求，将access_token和refresh_token放入post body
//    服务端：验证access_token和refresh_token存在，且refresh_token未过期，makeTokens(uid)
//           若refresh_token已过期，则返回401，重新登陆

const makeTokens = exports.makeTokens = function (uid, options) {
  const opts = Object.assign({
    tokenTimeout: 10 * 60,
    refreshTimeout: 3 * 24 * 60 * 60
  }, options);
  const current = Date.getCurrentStamp();
  const expire = current + opts.tokenTimeout;
  const refreshExpire = current + opts.refreshTimeout;
  const { key, code } = encrypt2(JSON.stringify({ type: 'access_token', uid, expire }));
  const refreshAssets = encrypt2(JSON.stringify({ type: 'refresh_token', uid, expire: refreshExpire }));
  return {
    tokenKey: key,
    refreshKey: refreshAssets.key,
    refreshExpire: refreshExpire,
    tokens: {
      access_token: code,
      refresh_token: refreshAssets.code,
      expire_at: expire
    }
  };
};

const makeEncryptedQuery = exports.makeEncryptedQuery = function (token, query, options) {
  const opts = Object.assign({
    mix: encrypt,
    join: defaultEncryptOptions.join
  }, options);
  const timestamp = Date.getCurrentStamp();
  const [key, encryptedQuery] = encrypt(JSON.stringify(query)).split(opts.join);
  const mixed = opts.mix(`token=${token}&key=${key}&timestamp=${timestamp}`);
  return {
    credential: encrypt(JSON.stringify({
      token, mixed, timestamp
    })), q: encryptedQuery
  };
};

const extractCredential = exports.extractCredential = function (credential, options) {
  if (typeof credential !== 'string') {
    throw new Error('credential must be string!');
  }
  const opts = Object.assign({
    remix: decrypt,
    expire: 30
  }, options);
  const current = Date.getCurrentStamp();
  try {
    const { token, mixed, timestamp } = parseJSON(decrypt(credential));
    const origin = querystring.parse(opts.remix(mixed));
    if (
      origin.token !== token ||
      origin.timestamp.toString() !== timestamp.toString() ||
      current - timestamp > opts.expire
    ) {
      return null;
    }
    return origin;
  } catch (e) {
    return null;
  }
};

const extractQuery = exports.extractQuery = function (credential, encryptedQuery, options) {
  const opts = Object.assign({
    join: defaultEncryptOptions.join
  }, options);
  const origin = extractCredential(credential, opts);
  if (origin) {
    const { token, key, timestamp } = origin;
    return { token, key, query: parseJSON(decrypt(key + opts.join + encryptedQuery)), timestamp };
  }
  return null;
};

exports.signin = function (user, verifyUser, saveTokens, options) {
  const opts = Object.assign({
    userIdField: 'user_id'
  }, options);
  return new Promise(function (resolve, reject) { 
    const caught = function (err) {
      reject(err);
    };
    verifyUser(user).then(function (verifiedUser) {
      const uid = verifiedUser[opts.userIdField];
      const tokens = makeTokens(uid, opts);
      saveTokens(uid, tokens).then(function (result) {
        result && resolve({ user: verifiedUser, tokens: tokens.tokens }) || reject('save token error!');
      }).catch(caught);
    }).catch(caught);
  });
};

exports.handleQuery = function (
  credential, encryptedQuery, verifyToken, executeQuery, options
) {
  const { token, query } = extractQuery(credential, encryptedQuery, options);
  return new Promise(function (resolve, reject) {
    const caught = function (err) {
      reject(err);
    };
    verifyToken(token).then(function (user) {
      executeQuery({ user, query }).then(resolve).catch(caught);
    }).catch(caught);
  });
};

exports.refreshTokens = function (tokens, verifyAndSaveRefreshToken, options) {
  const { refresh_token } = tokens;
  return new Promise(function (resolve, reject) {
    const caught = function (err) {
      reject(err);
    };
    const refreshedTokens = makeTokens(uid, options);
    verifyAndSaveRefreshToken(refresh_token, refreshedTokens)
      .then(resolve).catch(caught);
  });
};
