'use strict'

const serveStatic = require('serve-static')
const final = require('finalhandler')
const url = require('url')
const http = require('http')

const createServer = (port, runner, tests, cb) => {
	if ('string' !== typeof runner) throw new Error('You must specify runner code.')
	if ('string' !== typeof tests) throw new Error('You must specify test code.')

	const send = (res, type, data) => {
		res.setHeader('Content-Type', type)
		res.end(data)
	}

	const serve = serveStatic(__dirname, {
		cacheControl: false,
		fallthrough: false,
		lastModified: false
	})

	const sendJS = (res, data) => {
		res.setHeader('Content-Type', 'text/javascript')
		res.end(data)
	}

	const server = http.createServer((req, res) => {
		const pathname = url.parse(req.url).pathname
		if (pathname === '/runner.js') return sendJS(res, runner)
		if (pathname === '/tests.js') return sendJS(res, tests)

		serve(req, res, final(req, res))
	})

	server.listen(port, (err) => {
		if (err) cb(err)
		else cb(null, server)
	})
}

module.exports = createServer
