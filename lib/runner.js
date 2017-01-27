'use strict'

const passthrough = require('readable-stream/passthrough')
const websocket = require('websocket-stream')
const redirectConsole = require('console-redirect')

require('source-map-support/register')

const console = passthrough()
redirectConsole(console, console)

const reporter = websocket('ws://' + location.host + '/')
console.pipe(reporter)

const log = document.querySelector('#log')
console.on('data', (data) => {
	log.innerText += data.toString('utf8')
})
