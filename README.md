# mic-stream

> Get a stream of audio data from the microphone on the browser or with Node!

## background

I was developing a streaming version of
[goertzel](https://github.com/noffle/goertzel) for frequency detection, but
alas: I could not find a streaming microphone module that supported both Node
and the browser. So: I wrote one.

## example

Let's pipe our microphone input back to our speakers: feedback loop fun!

```js
var mic = require('mic-stream')
var speaker = require('audio-speaker')

mic().pipe(speaker())
```

## api

```js
var mic = require('mic-stream')
```

### var stream = mic(format={})

Creates a new [audio-through](https;//github.com/audio-lib/audio-through) stream
from the local microphone. If on the browser, the user may be first asked for
permission.

`format` is an object that decides the format of the audio data received. It
takes a wide variety of parameters. These are defaults:

```
{
  signed: true,
  float: false,
  bitDepth: 16,
  byteOrder: 'LE',  // or BE, if you're on a big-endian system
  channels: 2,
  sampleRate: 44100,
  interleaved: false,
  samplesPerFrame: 44100,
  sampleSize: 2,
  id: 'S_16_LE_2_44100_I',
  max: 32678,
  min: -32768
}
```

The returned `stream` can be treated like a regular Node stream and piped
where ever you'd like.

## install

With [`npm`](http://npmjs.org/), run

```
npm install mic-stream
```

For browser use you'll need a tool like [browserify](https://browserify.com).

Node users will need a working install of [sox](http://sox.sourceforge.net).

## license

ISC

## works well with..

> [audio-speaker](https://github.com/audio-lab/audio-speaker) - Pipe audio data
> straight to your speaker. Works in Node and the browser!

> [goertzel-stream](https://github.com/noffle/goertzel-stream/) - Detect
> specific frequencies from a stream of audio data.
