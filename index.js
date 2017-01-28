'use strict'

const fs = require('fs')
const path = require('path')
const stream = require('stream')
const websocket = require('websocket-stream')
const parser = require('tap-parser')

const createServer = require('./lib/server')
const createTunnel = require('./lib/tunnel')
const createSauce = require('./lib/sauce')

const runner = fs.readFileSync(path.join(__dirname, 'lib/runner.bundle.js'), {encoding: 'utf8'})

const run = (opt = {}) => {
	if (!opt.user) throw new Error('You must specify a Sauce Labs user.')
	if (!opt.key) throw new Error('You must specify a Sauce Labs access key.')
	if (!opt.platform) throw new Error('You must specify a platform.')
	if (!opt.browser) throw new Error('You must specify a browser.')
	if (!opt.tests) throw new Error('You must specify test code.')

	const out = new stream.PassThrough()

	const connections = []
	out.once('end', () => {
		for (let connection of connections)
			connection.destroy()
	})

	// todo: find port
	createTunnel(3000, (err, tunnel) => {
		if (err) return out.emit('error', err)

		createServer(3000, runner, opt.tests, (err, server) => {
			if (err) return out.emit('error', err)

			server.on('connection', (c) => connections.push(c))
			out.once('end', () => {
				server.close()
			})

			// receive TAP from client
			websocket.createServer({server}, (tap) => {
				tap.pipe(out)
				tap.once('end', () => tap.destroy())
			})

			createSauce({
				user: opt.user, key: opt.key,
				platform: opt.platform, browser: opt.browser,
				url: tunnel.url
			}, (err) => {
				if (err) return out.emit('error', err)
			})
		})
	})

	return out
}

module.exports = run
