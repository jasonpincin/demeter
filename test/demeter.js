var test    = require('tape'),
    demeter = require('..')

var ci     = demeter({dir: __dirname + '/demeter-ci' })

test('demeter', function (t) {
    t.equal(typeof ci, 'object',                        'demeter() returns an object (ci)')
    t.equal(ci.repodir, __dirname + '/demeter-ci/repo', 'ci.repodir has expected value')
    t.end()
})
