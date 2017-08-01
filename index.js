var spawn = require('child_process').spawn
var os = require('os')
var Through = require('audio-through')

module.exports = function micStream (outputFormat) {
  var inputFormat = {
    signed: true,
    float: false,
    bitDepth: 16,
    byteOrder: os.endianness instanceof Function ? os.endianness() : 'LE',
    channels: 2,
    sampleRate: 44100,
    interleaved: true,
    samplesPerFrame: 1024,
    sampleSize: 2,
    id: 'S_16_LE_2_44100_I',
    max: 32678,
    min: -32768
  }
  this.format = inputFormat

  outputFormat = outputFormat || inputFormat

  var p = micProcess()
  var through = new Through()
  var res = p.stdout.pipe(through)

  var killed = false
  res.stop = function stop (cb) {
    killed = true
    p.kill('SIGTERM')
    p.once('exit', cb)
  }

  p.once('exit', function onStop (code) {
    if (!killed && code !== 0) {
      p.emit('error', new Error('Recorder exited with ' + code + '.'))
    } else {
      p.stdout.unpipe(through)
    }
    through.end()
  })

  return res
}

function micProcess () {
  if (process.browser) {
    // todo: use saebekassebil/microphone-stream or merge with ahdinosaur/read-audio
    throw new Error('not implemented')
  } else if (process.platform === 'linux') {
    return spawn('arecord', [
      '-c', '2', // 2 channels
      '-r', '44100', // 44100Hz sample rate
      '-f', 'S16_LE', // little endian 16 bit
      '--buffer-size=16384'
    ])
  } else if (process.platform === 'darwin') {
    return spawn('rec', [ // see http://sox.sourceforge.net
      '-q', // don't show stats
      '-t', 'raw', // record as PCM
      '-c', '2', // 2 channels
      '-r', '44100', // 44100Hz sample rate
      '-b', '16', // little endian 16 bit
      '-' // write audio to stdout
    ])
  } else {
    throw new Error('mic-stream does not support ' + process.platform + '.')
  }
}
