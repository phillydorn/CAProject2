import jwtUtils from './jsonwebtoken';

const store = global.localStorage;
const document = global.document;

const fetchFromStore = (key) => {
  // load any stored value from sessionStorage
  let initValue = store && store.getItem(key);
  if (typeof initValue !== 'undefined') {
    try {
      initValue = JSON.parse(initValue);
    } catch (e) {
      // Nothing
    }
  }
  return initValue;
};

const storeValue = (key, value) => {
  store.setItem(key, value);
};

const storeCookie = (name, value, days) => {
  let expires;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toGMTString()}`;
  } else {
    expires = '';
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
};

const eraseCookie = (name) => {
  storeCookie(name, '', -1);
};

let userProfile;

const decodeUserFromJwt = (jwt) => {
  const decoded = jwtUtils.decode(jwt, { complete: true });
  userProfile = decoded.payload.profile;
  return userProfile;
};

const decodeAllJwt = (jwt) => {
  const decoded = jwtUtils.decode(jwt, { complete: true });
  const { payload } = decoded;
  return payload;
};

let refreshJwtTimerId;
function storeJwt(data, refreshJwt) {
  if (data.jwt && data.jwt !== 'undefined') {
    // store raw jwt
    storeValue('jwt', data.jwt);

    // decode and store mapUserId
    decodeUserFromJwt(data.jwt);
  }

  if (typeof refreshJwt === 'function') {
    clearInterval(refreshJwtTimerId);
    refreshJwtTimerId = setInterval(refreshJwt, 5 * 60 * 1000);
  }
  if (data.refresh_token) {
    // Store refresh token
    storeValue('refreshToken', data.refresh_token);
  }
}

function storePolicy(data) {
  const { policy, signature } = data;
  const keyId = data.key_id;
  storeCookie('CloudFront-Policy', policy);
  storeCookie('CloudFront-Key-Pair-Id', keyId);
  storeCookie('CloudFront-Signature', signature);
}

function clearPolicy() {
  eraseCookie('CloudFront-Policy', '');
  eraseCookie('CloudFront-Key-Pair-Id', '');
  eraseCookie('CloudFront-Signature', '');
}

// Init JWT from session store
let sessionJwt = fetchFromStore('jwt');
if (sessionJwt) {
  storeJwt({ jwt: sessionJwt });
}

function readOnlyJwt() {
  return fetchFromStore('jwt');
}

function readOnlyRefreshToken() {
  return fetchFromStore('refreshToken');
}

function readOnlyPolicy() {
  const policy = fetchFromStore('policy');
  const keyId = fetchFromStore('keyId');
  const signature = fetchFromStore('signature');

  return { policy, keyId, signature };
}

function readOnlyUser() {
  sessionJwt = fetchFromStore('jwt');

  if (sessionJwt) {
    if (sessionJwt === 'undefined') {
      storeValue('jwt', null);
    } else {
      return decodeUserFromJwt(sessionJwt);
    }
  }
  return null;
}

function readOnlyUserData() {
  sessionJwt = fetchFromStore('jwt');

  if (sessionJwt) {
    if (sessionJwt === 'undefined') {
      storeValue('jwt', null);
    } else {
      return decodeAllJwt(sessionJwt);
    }
  }
  return null;
}

function logout() {
  // clear JWT
  storeValue('jwt', null);
  // clear user data
  userProfile = null;
  // Clear refresh token
  storeValue('refreshToken', null);
  clearInterval(refreshJwtTimerId);
  clearPolicy();
}


module.exports = {
  storeJwt,
  storePolicy,
  jwt: readOnlyJwt,
  refreshToken: readOnlyRefreshToken,
  userData: readOnlyUserData,
  user: readOnlyUser,
  policy: readOnlyPolicy,
  logout,
};
