const net = require('net');
const exec = require('child_process').exec;

const hasPort = function (port, callback) {
  if (typeof port === 'undefined') {
    throw new Error('port is missing.')
  }
  const options = {
    port: Number(port) || Number(exports.port),
    server: net.createServer(function () {}),
  }

  function onListen () {
    options.server.removeListener('error', onError);
    options.server.close();
    callback(null, options.port);
  }

  function onError (err) {
    options.server.removeListener('listening', onListen);

    if (err.code !== 'EADDRINUSE' && err.code !== 'EACCES') {
      return callback(err);
    }

    hasPort(++options.port, callback);
  }

  options.server.once('error', onError);
  options.server.once('listening', onListen);
  options.server.listen(options.port);
}

exports.asyncPort = function (port) {
  if (typeof Promise !== 'function') {
    throw Error('Please install a polyfill and assign Promise to global.Promise before calling this method');
  }

  return new Promise(function (resolve, reject) {
    hasPort(port, function (err, port) {
      if (err) {
        return reject(err);
      }
      resolve(port);
    })
  })
}

exports.killPort = function (port) {
  port = port || process.argv[2];

  if (typeof port === 'undefined') {
    return console.log('port is missing.');
  }

  if (typeof Promise !== 'function') {
    throw Error('Please install a polyfill and assign Promise to global.Promise before calling this method');
  }

  return new Promise(function (resolve, reject) {
    exec(`lsof -i :${port} | grep LISTEN`, function (err, stdout, stderr) {
      const match = stdout.split(' ').filter(m => m.length);
      if (match.length) {
        exec(`kill -9 ${match[1]}`, function (err, stdout, stderr) {
          console.log(`port ${port} was closed.`);
          resolve();
        })
      } else {
        console.log(`port ${port} is not open.`);
        resolve();
      }
    })
  })
}
