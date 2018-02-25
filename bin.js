#!/usr/bin/env node
'use strict'

const mri = require('mri')
const sink = require('stream-sink')

const {version} = require('./package.json')
const run = require('.')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    chutney [--timeout <seconds>]

Options:
    --timeout  -t  Set the timeout in seconds. Default: 20

Examples:
    browserify test.js | chutney | tap-spec
\n`)
	process.exit(0)
}
if (argv.version || argv.v) {
	process.stdout.write(version + '\n')
	process.exit(0)
}

const showError = (err) => {
	console.error(err.data || err)
	process.exit(1)
}

if ('string' !== typeof process.env.SAUCE_USER) {
	showError('You must export SAUCE_USER.')
}
if ('string' !== typeof process.env.SAUCE_KEY) {
	showError('You must export SAUCE_KEY.')
}
if ('string' !== typeof process.env.PLATFORM) {
	showError('You must export PLATFORM.')
}
if ('string' !== typeof process.env.BROWSER) {
	showError('You must export BROWSER.')
}

let timeout
if (argv.timeout || argv.t) {
	timeout = parseInt(argv.timeout || argv.t)
	if (Number.isNaN(timeout)) showError('Timeout must be a number.')
}

process.stdin
.pipe(sink())
.then((tests) => {
	run({
		user: process.env.SAUCE_USER, key: process.env.SAUCE_KEY,
		platform: process.env.PLATFORM, browser: process.env.BROWSER,
		timeout,
		tests
	})
	.once('error', showError)
	.pipe(process.stdout)
})
.catch(showError)
