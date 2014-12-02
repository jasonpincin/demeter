#!/usr/bin/env node

var http    = require('http')
,   demeter = require('..')
,   argv    = require('minimist')(process.argv.slice(2), {
    alias: {
        'repos': 'r',
        'help': 'h',
        'port': 'p'
    },
    default: {
        'port': 8001,
        'repos': './demeter-ci'
    }
})

if (argv.help) {
    console.log([
        'Demeter - A simple node integration and build server',
        '',
        'Usage:',
        '  demeter -r PATH',
        '',
        'Options:',
        '  -r, --repos  Path to store commits & builds',
        '  -h, --help   This help'
    ].join('\n'))
    process.exit(2)
}

var ci     = demeter({ repos: argv.repos })
,   server = http.createServer(ci.handle)

server.on('listening', function () {
    console.log('Demeter started on port %s', server.address().port)
})

server.listen(argv.port)
