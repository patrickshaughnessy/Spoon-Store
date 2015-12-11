/* */ 
(function(process) {
  'use strict';
  function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0)
        continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i))
        continue;
      target[i] = obj[i];
    }
    return target;
  }
  var ExecutionEnvironment = require('./ExecutionEnvironment');
  var Promise = require('./Promise');
  var sprintf = require('./sprintf');
  var fetch = require('./fetch');
  var warning = require('./warning');
  var DEFAULT_FETCH_TIMEOUT = 15000;
  var DEFAULT_RETRY_DELAYS = [1000, 3000];
  function fetchWithRetries(uri, initWithRetries) {
    var fetchTimeout = initWithRetries.fetchTimeout;
    var retryDelays = initWithRetries.retryDelays;
    var init = _objectWithoutProperties(initWithRetries, ['fetchTimeout', 'retryDelays']);
    var nonNullFetchTimeout = fetchTimeout || DEFAULT_FETCH_TIMEOUT;
    var nonNullRetryDelays = retryDelays || DEFAULT_RETRY_DELAYS;
    var requestsAttempted = 0;
    var requestStartTime = 0;
    return new Promise(function(resolve, reject) {
      function sendTimedRequest() {
        requestsAttempted++;
        requestStartTime = Date.now();
        var isRequestAlive = true;
        var request = fetch(uri, init);
        var requestTimeout = setTimeout(function() {
          isRequestAlive = false;
          if (shouldRetry(requestsAttempted)) {
            process.env.NODE_ENV !== 'production' ? warning(false, 'fetchWithRetries: HTTP timeout, retrying.') : undefined;
            retryRequest();
          } else {
            reject(new Error(sprintf('fetchWithRetries(): Failed to get response from server, ' + 'tried %s times.', requestsAttempted)));
          }
        }, nonNullFetchTimeout);
        request.then(function(response) {
          clearTimeout(requestTimeout);
          if (isRequestAlive) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response);
            } else if (shouldRetry(requestsAttempted)) {
              process.env.NODE_ENV !== 'production' ? process.env.NODE_ENV !== 'production' ? warning(false, 'fetchWithRetries: HTTP error, retrying.') : undefined : undefined, retryRequest();
            } else {
              reject(response);
            }
          }
        })['catch'](function(error) {
          clearTimeout(requestTimeout);
          if (shouldRetry(requestsAttempted)) {
            retryRequest();
          } else {
            reject(error);
          }
        });
      }
      function retryRequest() {
        var retryDelay = nonNullRetryDelays[requestsAttempted - 1];
        var retryStartTime = requestStartTime + retryDelay;
        setTimeout(sendTimedRequest, retryStartTime - Date.now());
      }
      function shouldRetry(attempt) {
        return ExecutionEnvironment.canUseDOM && attempt <= nonNullRetryDelays.length;
      }
      sendTimedRequest();
    });
  }
  module.exports = fetchWithRetries;
})(require('process'));
