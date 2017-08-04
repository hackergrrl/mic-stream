var Through = require('audio-through')

module.exports = function micStream (outputFormat, micProcess) {
  var inputFormat = {
    signed: true,
    float: false,
    bitDepth: 16,
    byteOrder: 'LE',
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