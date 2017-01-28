'use strict'

const test = require('tape')
const isBrowser = require('is-in-browser')

test('running in a browser', (t) => {
	t.plan(1)
	t.equal(isBrowser, true)
})
