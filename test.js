'use strict'

var test = require('tape')
var isStream = require('is-stream')
var micStream = require('.')
var Through = require('audio-through')
var AudioBuffer = require('audio-buffer')

test('can start, is a stream, can stop', function (t) {
  t.plan(2)

  var s = micStream()
  t.ok(isStream.readable(s), 'returns a readable stream')
  s.stop(function () {
    t.ok(true, 'stopped')
  })
  s.on('error', t.ifError)
})

test('emits AudioBuffer objects', function (t) {
  t.plan(3)

  var s = micStream()
  s.pipe(Through())
  s.once('data', function (buf) {
    t.ok(buf instanceof AudioBuffer, 'isn\'t an AudioBuffer object')
    t.ok(buf.length > 0, 'buffer is empty')
    s.stop(function () {
      t.ok(true)
    })
  })
  s.on('error', t.ifError)
})
