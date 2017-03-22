import doFetch from 'isomorphic-fetch';
import auth from './auth';

const location = global.location;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}


export default function fetch(logger) {
  function safeLog(level, data) {
    if (logger) {
      logger[level](data);
    }
  }

  const log = {
    info: safeLog.bind(safeLog, 'info'),
    error: safeLog.bind(safeLog, 'error'),
  };

  return (path, options = {}) => {

    options.headers = options.headers || {};
    if (options.data || options.body) {
      options.headers['Content-Type'] = 'application/json';
    }
      options['credentials'] = 'same-origin';

    const url = path;

    const makeRequest = () => {

      log.info({ message: 'api request', apUrl: url, options });
      return doFetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(function(data) {
          console.log(`request to ${url} succeeded with JSON response ${data}`)
          return data;
        }).catch(function(error) {
          console.log('request failed', error)
          return error
        })

      };

    return makeRequest();
  };
}


