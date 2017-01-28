'use strict'

const parser = require('tap-parser')

const onFinish = (tap, cb) => {
	let expected = Infinity, i = 0

	tap
	.pipe(parser())
	.on('comment', (c) => {
		if (i >= expected && c.trim() === '# ok') cb()
	})
	.on('plan', (plan) => {
		expected = plan.end
	})
	.on('assert', () => i++)
}

module.exports = onFinish
