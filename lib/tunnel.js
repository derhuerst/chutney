'use strict'

const localtunnel = require('localtunnel')

const createTunnel = (port) => {
	if ('number' !== typeof port) throw new Error('You must specify a port.')
	return localtunnel({port})
}

module.exports = createTunnel
