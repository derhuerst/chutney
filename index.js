'use strict'

const debug = require('debug')('chutney')
const fs = require('node:fs')
const path = require('node:path')
const stream = require('node:stream')
const websocket = require('websocket-stream')
const parser = require('tap-parser')

const onFinish = require('./lib/tap-on-finish')
const createServer = require('./lib/server')
const createTunnel = require('./lib/tunnel')
const createSauce = require('./lib/sauce')

const runner = fs.readFileSync(path.join(__dirname, 'lib/runner.bundle.js'), {encoding: 'utf8'})

const run = async (opt = {}) => {
	if (!opt.user) throw new Error('You must specify a Sauce Labs user.')
	if (!opt.key) throw new Error('You must specify a Sauce Labs access key.')
	if (!opt.platform) throw new Error('You must specify a platform.')
	if (!opt.browser) throw new Error('You must specify a browser.')
	if (!opt.tests) throw new Error('You must specify test code.')
	if (opt.timeout !== undefined) {
		if ('number' !== opt.timeout) throw new Error('timeout must be a number.')
	} else opt.timeout = 20 * 1000

	const out = new stream.PassThrough()
	const emitError = (err) => {
		out.emit('error', err)
		if (opt.bailout !== false && !out._writableState.ended) {
			const msg = err && err.message || (err + '')
			out.write('Bail out! ' + msg)
		}
	}

	const httpConnections = []
	const wsConnections = []

	debug('creating tunnel')
	// todo: find port
	const tunnel = await createTunnel(3000)
	tunnel.on('error', err => emitError(err))
	out.once('end', () => tunnel.close())

	debug('creating HTTP server')
	const server = await createServer(3000, runner, opt.tests)

	let stopped = false
	const stop = () => {
		if (stopped) return null
		stopped = true
		debug('stopping')

		for (let tap of wsConnections) {
			tap.unpipe(out)
			tap.destroy()
		}
		for (let connection of httpConnections) {
			connection.destroy()
		}
		server.close()
	}
	out.once('end', stop)

	const onTimeout = () => {
		debug('timeout')
		if (!out._writableState.ended) {
			out.end('\nnot ok test timed out after ' + opt.timeout + ' ms\n')
		}
		stop()
	}
	let timeout = setTimeout(onTimeout, opt.timeout)
	out.on('data', () => {
		clearTimeout(timeout)
		timeout = setTimeout(onTimeout, opt.timeout)
	})

	server.on('connection', (connection) => {
		httpConnections.push(connection)
	})

	// receive TAP from client
	debug('creating WS server')
	websocket.createServer({server}, (tap) => {
		debug('WS connection!')
		wsConnections.push(tap)
		tap.pipe(out)
	})

	debug('creating SauceLabs tunnel')
	const driver = await createSauce({
		user: opt.user, key: opt.key,
		platform: opt.platform, browser: opt.browser,
		url: tunnel.url
	})

	out.emit('driver', driver)

	return out
}

module.exports = run
