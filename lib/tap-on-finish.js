'use strict'

const Parser = require('tap-parser')

const onFinish = (tap, cb) => {
	let expected = Infinity, i = 0

	tap
	.pipe(new Parser())
	.on('comment', (c) => {
		if (i >= expected && c.trim() === '# ok') cb()
	})
	.on('plan', (plan) => {
		expected = plan.end
	})
	.on('assert', () => i++)
}

module.exports = onFinish
