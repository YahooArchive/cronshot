var isObject = function(obj) { 
  if(!obj) 
    return false;

  return Object.prototype.toString.call(obj) === '[object Object]';
};

var isArray = function(arr) {
    if(!arr) 
      return false;

    if('isArray' in Array) {
      return Array.isArray(arr);
    } 
    else {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }
};

var each = function(collection, callback) {
  var x, len;
  if(isArray(collection)) {
    x = -1;
    len = collection.length;
    while(++x < len) {
      if (callback(x, collection[x]) === false) {
        break;
      }
    }
  } 
  else if(isObject(collection)) {
    for(x in collection) {
      if(collection.hasOwnProperty(x)) {
        if (callback(x, collection[x]) === false) {
          break;
        }
      }
    }
  }
  else {
    throw new Error('Unsupported Collection');
  }
};

var mergeOptions = function deepMerge(defaultOptions, userOptions) {
  if(!isObject(defaultOptions) || !isObject(userOptions) 
    || !Object.keys) {
    return;
  }
  var newObj = {};

  each(defaultOptions, function(key, val) {
    newObj[key] = defaultOptions[key];
  });

  each(userOptions, function(key, val) {
    var currentUserOption = userOptions[key];
    if(!isObject(currentUserOption)) {
      newObj[key] = currentUserOption;
    } 
    else {
      if(!defaultOptions[key]) {
        newObj[key] = currentUserOption;
      } 
      else {
        newObj[key] = deepMerge(defaultOptions[key], currentUserOption);
      }
    }
  });

  return newObj;
};

var getCommandLineOptions = function() {
  var argsObj = {};

  process.argv.forEach(function(arg, iterator) {
    if(arg.charAt(0) === '-' && arg.charAt(1) === '-') {
      argsObj[arg.substring(2, arg.length)] = process.argv[iterator + 1];
    }
  });

  return argsObj;
}

var noop = function noop() {};

var makeLog = function(type, info) {
  console.log('[' + type + '] ['+ new Date().toUTCString() + '] ' + info);
}

var logError = function(msg) {
  makeLog('Error', msg);
}

var log = function(msg) {
  makeLog('Log', msg);
}

module.exports = {
  isObject: isObject,
  isArray: isArray,
  each: each,
  mergeOptions: mergeOptions,
  getCommandLineOptions: getCommandLineOptions,
  log: log,
  logError: logError,
  noop: noop
};
