#!/usr/bin/env node
'use strict'

const sink = require('stream-sink')

const pkg = require('./package.json')
const run = require('.')
// const run = require('./dummy-runner')

const args = process.argv.slice(2).join(' ').trim()

if (args === '-h' || args === '--help') {
	process.stdout.write(pkg.description + '\n')
	// todo
	process.exit(0)
}
if (args === '-v' || args === '--version') {
	process.stdout.write(pkg.version + '\n')
	process.exit(0)
}

const showError = (err, trace = true) => {
	console.error(trace ? err : err.message)
	process.exit(1)
}

if ('string' !== typeof process.env.SAUCE_USER)
	showError('You must export SAUCE_USER.', false)
if ('string' !== typeof process.env.SAUCE_KEY)
	showError('You must export SAUCE_KEY.', false)
if ('string' !== typeof process.env.PLATFORM)
	showError('You must export PLATFORM.', false)
if ('string' !== typeof process.env.BROWSER)
	showError('You must export BROWSER.', false)

process.stdin
.pipe(sink())
.then((tests) => {
	run({
		user: process.env.SAUCE_USER, key: process.env.SAUCE_KEY,
		platform: process.env.PLATFORM, browser: process.env.BROWSER,
		tests
	})
	.on('error', showError)
	.pipe(process.stdout)
})
