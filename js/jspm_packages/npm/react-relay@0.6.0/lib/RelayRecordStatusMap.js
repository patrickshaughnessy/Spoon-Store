/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayRecordStatusMap
 * 
 * @typechecks
 */

'use strict';
/**
 * Record might contain data from optimistic update.
 */
var OPTIMISTIC_MASK = 0x01;
/**
 * Record was part of a mutation that resulted in an error.
 */
var ERROR_MASK = 0x02;

function set(status, value, mask) {
  status = status || 0;
  if (value) {
    return status | mask;
  } else {
    return status & ~mask;
  }
}

function check(status, mask) {
  return ((status || 0) & mask) != 0;
}
/**
 * A set of functions for modifying `__status__` on records inside of
 * RelayStore.
 */
var RelayRecordStatusMap = {
  setOptimisticStatus: function setOptimisticStatus(status, value) {
    return set(status, value, OPTIMISTIC_MASK);
  },

  isOptimisticStatus: function isOptimisticStatus(status) {
    return check(status, OPTIMISTIC_MASK);
  },

  setErrorStatus: function setErrorStatus(status, value) {
    return set(status, value, ERROR_MASK);
  },

  isErrorStatus: function isErrorStatus(status) {
    return check(status, ERROR_MASK);
  }
};

module.exports = RelayRecordStatusMap;