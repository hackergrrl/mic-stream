var spawn = require('child_process').spawn
var os = require('os')
var Through = require('audio-through')

module.exports = function (outputFormat) {

  var inputFormat = {
    signed: true,
    float: false,
    bitDepth: 16,
    byteOrder: os.endianness instanceof Function ? os.endianness() : 'LE',
    channels: 2,
    sampleRate: 44100,
    interleaved: false,
    samplesPerFrame: 44100,
    sampleSize: 2,
    id: 'S_16_LE_2_44100_I',
    max: 32678,
    min: -32768
  }
  this.format = inputFormat

  outputFormat = outputFormat || inputFormat

  // TODO: use web/node based on detection
  var stream = nodeMicStream()

  var through = new Through(
    inputFormat,
    outputFormat
  );

  stream.pipe(through)

  // TODO: handle errors

  return through
}

function nodeMicStream () {
  var args = [
    '-r',
    '44100',
    '-t',
    's16',
    '-c',
    '2',
    '-'
  ]
  return spawn('rec', args).stdout
}

function browserMicStream () {
  throw new Error('not implemented')
}
