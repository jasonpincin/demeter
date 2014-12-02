var http    = require('http'),
    demeter = require('..')

var ci     = demeter(__dirname + '/repos')
,   server = http.createServer(ci.handle)
