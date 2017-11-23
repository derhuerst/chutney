'use strict'

const passthrough = require('readable-stream/passthrough')
const websocket = require('websocket-stream')
const redirectConsole = require('console-redirect')
const onFinish = require('./tap-on-finish')

require('source-map-support/register')

const tap = passthrough()
const debug = console.info.bind(console)
const logger = redirectConsole(tap, tap)

tap.write('# chutney: creating WebSocket reporter\n')
const reporter = websocket('wss://' + location.host + '/')
tap.pipe(reporter)

reporter.on('connect', () => {
	tap.write('# chutney: WebSocket reporter connected\n')
})
onFinish(tap, () => setTimeout(() => {
	tap.write('# chutney: closing WebSocket reporter\n')
	reporter.end()
	reporter.destroy()
	logger.release()
}, 100))

tap.write('# chutney: setting up visual log\n')
const log = document.querySelector('#log')
tap.on('data', (data) => {
	log.innerText += data.toString('utf8') + '\n'
})

reporter.once('connect', () => {
	tap.write('# chutney: attaching test script')
	const tests = document.createElement('script')
	tests.setAttribute('charset', 'utf-8')
	tests.setAttribute('src', '/tests.js')
	document.body.appendChild(tests)
})
