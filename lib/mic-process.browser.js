// heavily inspired by ahdinosaur/read-audio and saebekassebil/microphone-stream

var audioContext = require('audio-context')
var {Readable} = require('stream')
var ndsamples = require('ndsamples')

// "It is recommended for authors to not specify this buffer size and allow the
// implementation to pick a good buffer size to balance between latency and audio
// quality."
// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
// However, webkitAudioContext (safari) requires it to be set.
// Possible values: null, 256, 512, 1024, 2048, 4096, 8192, 16384
var bufferSize = window.AudioContext ? null : 4096;

module.exports = function micProcess (opt) {
  opt = opt || {}
  var channels = opt.channels || 1 // why not 2? stereo mics?

  var ctx = opt.context || audioContext()
  var src = opt.source
  if (isMediaStream(src)) {
    src = ctx.createMediaStreamSource(src)
  }

  var out = new Readable()

  var processor = ctx.createScriptProcessor(bufferSize, channels, channels)
  processor.onaudioprocess = onInput

  src.connect(processor)
  processor.connect(ctx.destination) // workaround for chrome bugs?
  // Save reference to Web Audio nodes, which prevents audio processing
  // from being garbage-collected.
  out.__source = source
  out.__processor = processor

  function onInput (ev) {
    var buf = ev.inputBuffer
    var channels = buf.numberOfChannels
    var samplesPerChannel = buf.length

    var samples = ndsamples({
      data: new Float32Array(samplesPerChannel * channels),
      shape: [samplesPerChannel, channels],
      format: {sampleRate: ctx.sampleRate}
    })

    for (var cI = 0; cI < channels; cI++) {
      var data = buf.getChannelData(cI)
      for (var sI = 0; sI < samplesPerChannel; sI++) {
        var sample = data[sI]
        samples.set(sI, cI, sample)
      }
    }

    out.push(samples)
  }

  // todo: implement a way to stop
  return out
}

function isMediaStream (obj) {
  return obj && !!window.MediaStream && obj instanceof window.MediaStream
}