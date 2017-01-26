# chutney

**Run tape tests at Sauce Labs.** A more opinionated [smokestack](https://github.com/hughsk/smokestack).

[![npm version](https://img.shields.io/npm/v/chutney.svg)](https://www.npmjs.com/package/chutney)
[![build status](https://img.shields.io/travis/derhuerst/chutney.svg)](https://travis-ci.org/derhuerst/chutney)
[![dependency status](https://img.shields.io/david/derhuerst/chutney.svg)](https://david-dm.org/derhuerst/chutney)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/chutney.svg)](https://david-dm.org/derhuerst/chutney#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/chutney.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)

**This tool exposes the test runner with your tests using [localtunnel](#https://github.com/localtunnel/localtunnel#readme), opens them in a [Webdriver](https://www.w3.org/TR/webdriver/)-controlled browser from [Sauce Labs](https://saucelabs.com/) and pipes their output to stdout.**

Compared to [smokestack](https://github.com/hughsk/smokestack), chutney is more lightweight because it can runy tests only on remote browsers. It is less battle-proven and has less niche features.


## Installing

```shell
npm install chutney
```


## Usage

**chutney requires you to have [TAP-generating tests](https://en.wikipedia.org/wiki/Test_Anything_Protocol), which you bundle** e.g. using [Browserify](https://github.com/substack/node-browserify#readme). **You will also need a Sauce Labs account.**

```js
# test.js
const test = require('tape')
const awesomeTool = require('.')

test('awesome tool is awesome', (t) => {
	t.plan(1)
	t.equal(awesomeTool(), 'awesome')
})
```

Export your Sauce Labs credentials as well as the desired platform & browser.

```shell
export SAUCE_USER=derhuerst
export SAUCE_KEY=1a04c633-6a58-4aba-8287-54fdd18f9851
export PLATFORM='Windows 10'
export BROWSER=Chrome
```

Now run the tests. You may pretty-print the results using [any reporter](https://github.com/substack/tape#pretty-reporters) like [tap-spec](https://github.com/scottcorgan/tap-spec#readme).

```shell
browserify test.js | chutney | tap-spec
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/location/issues).
