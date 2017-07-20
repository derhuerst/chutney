'use strict'

const passthrough = require('readable-stream/passthrough')
const websocket = require('websocket-stream')
const redirectConsole = require('console-redirect')
const onFinish = require('./tap-on-finish')

require('source-map-support/register')

const console = passthrough()
redirectConsole(console, console)

const reporter = websocket('wss://' + location.host + '/')
console.pipe(reporter)
onFinish(console, () => setTimeout(() => {
	reporter.end()
}, 100))

const log = document.querySelector('#log')
console.on('data', (data) => {
	log.innerText += data.toString('utf8')
})
