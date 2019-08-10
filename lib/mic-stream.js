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
  var out = new Through()
  p.pipe(out)

  out.stop = function stop (cb) {
    p.stop(cb)
  }

  p.once('error', function onError (err) {
    out.emit('error', err)
    out.end()
  })

  return out
}