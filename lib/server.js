'use strict'

const serveStatic = require('serve-static')
const final = require('finalhandler')
const url = require('url')
const http = require('http')

const createServer = (runner) => {
	if ('string' !== typeof runner) throw new Error('You must specify runner code.')

	const send = (res, type, data) => {
		res.setHeader('Content-Type', type)
		res.end(data)
	}

	const serve = serveStatic(__dirname, {
		cacheControl: false,
		fallthrough: false,
		lastModified: false
	})

	return http.createServer((req, res) => {
		const pathname = url.parse(req.url).pathname
		if (pathname === '/runner.js') {
			res.setHeader('Content-Type', 'text/javascript')
			res.end(runner)
			return
		}

		serve(req, res, final(req, res))
	})
}

module.exports = createServer
