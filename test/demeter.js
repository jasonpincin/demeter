var test    = require('tape'),
    demeter = require('..')

test('demeter', function (t) {
    var ci = demeter({repos: __dirname + '/var' })

    t.equal(typeof ci, 'object')
    t.equal(ci.repodir, __dirname + '/var/repo')

    t.end()
})
