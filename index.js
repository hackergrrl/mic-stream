if (process.browser) {
  module.exports = require('./index.browser.js')
} else {
  module.exports = require('./index.node.js')
}