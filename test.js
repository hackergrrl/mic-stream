'use strict'

var test = require('tape')
var isStream = require('is-stream')
var micStream = require('.')
var Through = require('audio-through')

test('can start, is a stream, can stop', function (t) {
  t.plan(2)

  var s = micStream()
  t.ok(isStream.readable(s), 'returns a readable stream')
  s.stop(function () {
    t.ok(true)
  })
  s.on('error', t.ifError)
})

test('emits AudioBuffer objects', function (t) {
  t.plan(3)

  var s = micStream()
  s.pipe(Through())
  s.once('data', function (buf) {
    t.ok(buf.constructor.name === 'AudioBuffer', 'isn\'t an AudioBuffer object')
    t.ok(buf.data.length > 0, 'buffer is empty')
    s.stop(function () {
      t.ok(true)
    })
  })
  s.on('error', t.ifError)
})
