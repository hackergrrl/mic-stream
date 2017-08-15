// heavily inspired by ahdinosaur/read-audio and saebekassebil/microphone-stream

var audioContext = require('audio-context')
var getUserMedia = require('get-user-media-promise')
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
  var out = new Readable({
    objectMode: true, // todo: this should not be necessary
    read: function () {}
  })

  if (opt.source) {
    connect(opt.source)
  } else {
    const p = getUserMedia({video: false, audio: true})
    .then(connect)

    out.stop = function preliminaryStop (cb) {
      p.then(function () {
        out.stop(cb)
      })
    }

    p.catch(function (err) {
      out.emit('error', err)
      out.close()
    })
  }

  function connect (src) {
    if (isMediaStream(src)) {
      src = ctx.createMediaStreamSource(src)
    }

    var processor = ctx.createScriptProcessor(bufferSize, channels, channels)
    processor.onaudioprocess = onInput
    processor.connect(ctx.destination) // workaround for chrome bugs?

    src.connect(processor)
    // Save reference to Web Audio nodes, which prevents audio processing
    // from being garbage-collected.
    out.__source = src
    out.__processor = processor

    let stopped = false
    out.stop = function stop (cb) {
      if (!stopped) {
        src.disconnect(processor)
        processor.disconnect(ctx.destination)
        stopped = true
      }
      setTimeout(cb)
    }
  }

  function onInput (ev) {
    out.push(ev.inputBuffer)
  }

  return out
}

function isMediaStream (obj) {
  return obj && !!window.MediaStream && obj instanceof window.MediaStream
}