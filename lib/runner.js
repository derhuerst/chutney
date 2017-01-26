'use strict'

const shoe = require('shoe')
const redirectConsole = require('console-redirect')

redirectConsole(shoe('/chutney'))

require('source-map-support/register')
