var Speaker = require('speaker')

process.stdin.pipe(new Speaker({
	channels: 2,
	bitDepth: 16,
	sampleRate: 44100
}))