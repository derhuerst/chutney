# chutney

**Run [TAP](https://en.wikipedia.org/wiki/Test_Anything_Protocol) tests at Sauce Labs.** A more opinionated [smokestack](https://github.com/hughsk/smokestack).

[![npm version](https://img.shields.io/npm/v/chutney.svg)](https://www.npmjs.com/package/chutney)
[![build status](https://img.shields.io/codeship/9cea8f70-b28e-0135-65f0-768b43f5dae4/master.svg)](https://app.codeship.com/projects/258106)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/chutney.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)

**This tool exposes the test runner with your tests using [localtunnel](https://github.com/localtunnel/localtunnel#readme), opens them in a [Webdriver](https://www.w3.org/TR/webdriver/)-controlled browser from [Sauce Labs](https://saucelabs.com/) and pipes their output to `stdout`.** It is is heavily inspired by [smokestack](https://github.com/hughsk/smokestack), but more lightweight because it will run the tests only on *remote* browsers. It is less battle-proven and has less niche features.

[airtap](https://github.com/airtap/airtap) is a another, well-known alternative.


## Installing

```shell
npm install chutney
```


## Guide

**chutney requires you to have [TAP-generating tests](https://en.wikipedia.org/wiki/Test_Anything_Protocol), which you bundle** e.g. using [Browserify](https://github.com/substack/node-browserify#readme). **You will also need a [Sauce Labs](https://saucelabs.com/) account.**

```js
// test.js
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


## Usage

```
Usage:
    chutney [--timeout <seconds>]

Options:
    --timeout  -t  Set the timeout in seconds. Default: 20

Examples:
    browserify test.js | chutney | tap-spec
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/location/issues).
