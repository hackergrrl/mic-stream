var spawn = require('child_process').spawn
var pathToSox = require('sox-static')

module.exports = function micProcess () {
  var p
  if (process.platform === 'linux' || process.platform === 'darwin') {
    p = spawn(pathToSox, [ // see http://sox.sourceforge.net
      '-q', // don't show stats
      '-d', // use default audio device
      '-t', 'raw', // record as PCM
      '-c', '2', // 2 channels
      '-r', '44100', // 44100Hz sample rate
      '-b', '16', // little endian 16 bit
      '-' // write audio to stdout
    ])
  } else {
    throw new Error('mic-stream does not support ' + process.platform + '.')
  }

  var out = p.stdout
  var killed = false

  out.stop = function stop (cb) {
    killed = true
    p.kill('SIGTERM')
    p.once('exit', cb)
  }

  p.once('exit', function onStop (code) {
    if (!killed && code !== 0) {
      out.emit('error', new Error('Recorder exited with ' + code + '.'))
    }
    out.end()
  })

  return out
}
