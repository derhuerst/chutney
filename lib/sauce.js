'use strict'

const wd = require('wd')

const createSauce = async (data) => {
	const sauce = wd.remote('ondemand.saucelabs.com', 80, data.user, data.key)

	await new Promise((resolve, reject) => {
		sauce.init({
			browserName: data.browser,
			platform: data.platform,
			javascriptEnabled: true,
			recordVideo: false
		}, (err) => {
			if (err) return reject(err)
			sauce.get(data.url, (err) => {
				if (err) reject(err)
				else resolve()
			})
		})
	})

	return sauce
}

module.exports = createSauce
