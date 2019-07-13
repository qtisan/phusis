const __logger__ = console;

function Exception(message, code, error) {
  this.type = 'Exception';
  this.code = code || 0;
  this.message = message || `You got an unknown error! (${code})`;
  this.innerError = error || new Error(this.message);
  this.time = new Date();
}
Exception.prototype = Error.prototype;
Exception.prototype.log = function(logger) {
  logger = logger || __logger__ || console;
  logger.error(
    `[!EXCEPTION] -> ${this.time.toLocaleString()}|${this.name}(Code:${this.code}) - <line ${this
      .lineNumber || 0}, col ${this.columnNumber || 0}> - ${this.fileName ||
      'no file reference'} <----`
  );
  this.message && logger.error(`\t [message] - ${this.message}`);
  logger.error(`\t --`);
};
Exception.prototype.stacktrace = function(pages, logger) {
  logger = logger || __logger__ || console;
  pages = pages || 1;
  const pageSize = 10;
  let ex = this,
    max = pageSize * pages,
    i = 1;
  console.error(`= ERROR LOG START ========== `);
  while (ex && ex.message && i++ <= max) {
    console.error(`- <!LEVEL ${i}> ------------------- `);
    this.log(logger);
    ex = ex.innerError;
  }
  console.error(`= ERROR LOG END ========== `);
};

function _caught(error, message, code) {
  if (error instanceof Error) {
    return new Exception(
      typeof message === 'string' ? message : error.message,
      typeof message === 'number' ? message : code || error.number || 0,
      error
    );
  } else if (typeof error === 'string') {
    return new Exception(error, typeof message === 'number' ? message : 0);
  } else if (typeof error === 'number') {
    return new Exception('', error);
  } else {
    return new Exception();
  }
}

exports.Exception = Exception;
exports.isException = function(exception) {
  return exception instanceof Exception && exception.type === 'Exception';
};
exports.isError = function(error) {
  return error instanceof Error && !error.type;
};
exports.caught = _caught;
exports.errlog = function(err, logger) {
  if (err instanceof Exception) {
    err.log(logger || __logger__);
  } else {
    _caught(err).log(logger || __logger__);
  }
};
exports.setLogger = function(logger) {
  __logger__ = logger;
};
