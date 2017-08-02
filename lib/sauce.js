'use strict'

const wd = require('wd')

const createSauce = (data, cb) => {
	const sauce = wd.remote('ondemand.saucelabs.com', 80, data.user, data.key)

	sauce.init({
		browserName: data.browser,
		platform: data.platform,
		javascriptEnabled: true,
		recordVideo: false
	}, (err) => {
		if (err) return cb(err)
		sauce.get(data.url, (err) => {
			if (err) cb(err)
			else cb(null, sauce)
		})
	})

	return sauce
}

module.exports = createSauce
