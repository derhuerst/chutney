'use strict'

const localtunnel = require('localtunnel')

const createTunnel = (port, cb) => {
	if ('number' !== typeof port) throw new Error('You must specify a port.')
	if ('function' !== typeof cb) throw new Error('You must specify a callback.')

	localtunnel(port, (err, tunnel) => cb(err, tunnel))
}

module.exports = createTunnel
