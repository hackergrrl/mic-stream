var micStream = require('./lib/mic-stream')
var micProcess = require('./lib/mic-process.browser.js')

module.exports = function nodeMicStream (outputFormat) {
	return micStream(outputFormat, micProcess)
}