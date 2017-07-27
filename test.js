'use strict'

var assert = require('assert')
var isStream = require('is-stream')
var micStream = require('.')

var s = micStream()

assert.ok(isStream.readable(s), 'does not return a readable stream')

s.on('data', (buf) => {
  // todo: check if buf is an AudioBuffer
  assert.ok(buf.byteLength > 0, 'buffer is empty')
})

s.once('data', () => s.stop())