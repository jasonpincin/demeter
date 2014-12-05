#!/usr/bin/env node

var util     = require('util'),
    http     = require('http'),
    demeter  = require('..'),
    log      = require('log-stream')({name: 'demeter'}),
    through2 = require('through2'),
    split    = require('split'),
    pipeline = require('stream-combiner'),
    argv     = require('minimist')(process.argv.slice(2), {
    alias: {
        'dir': 'd',
        'help': 'h',
        'port': 'p',
        'output': 'o'
    },
    default: {
        'port': 8001,
        'dir': './demeter-ci',
        'output': 'text'
    }
})

if (argv.help) {
    console.log([
        'Demeter - A simple node integration and build server',
        '',
        'Usage:',
        '  demeter -d PATH',
        '',
        'Options:',
        '  -d, --dir    Path to store commits & builds',
        '  -o, --output Format to output logs in [text, json, none]',
        '  -h, --help   This help'
    ].join('\n'))
    process.exit(2)
}

var ci     = demeter({ dir: argv.dir }),
    server = http.createServer(ci.handle)

var text = pipeline(split(), through2(function (chunk, enc, cb) {
    var log = JSON.parse(chunk)
    this.push(util.format('%s %s %s\n', log.time, log.level, log.msg))
    cb()
}), process.stdout)

if (argv.output !== 'none')
    log.stream.pipe(argv.output === 'json' ? process.stdout : text)

server.on('listening', function () {
    log.info('demeter started on port %s', server.address().port)
})

ci.on('commit', function (commit) {
    log.info({commit: commit}, 'commit %s %s %s', commit.hash, commit.repo, commit.branch)
})

ci.on('install', function (install) {
    log.info({commit: install.commit}, 'install %s for %s', install.statusCode?'failed':'succeeded', install.commit.hash)
})

ci.on('test', function (test) {
    log.info({commit: test.commit}, 'test %s for %s', test.statusCode?'failed':'succeeded', test.commit.hash)
})

server.listen(argv.port)
