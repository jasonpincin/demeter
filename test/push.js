var test    = require('tape'),
    http    = require('http'),
    spawn   = require('child_process').spawn,
    demeter = require('..')

var demeterDir = '/tmp/demeter-test/' + Math.random().toString(16).slice(2),
    ci         = demeter({dir: demeterDir }),
    server     = http.createServer(ci.handle)

test('setup', function (t) {
    server.listen(0, t.end.bind(t))
})

test('push good test', function (t) {
    t.plan(2)
    var timeout = setTimeout(t.end.bind(t), 5000)

    ci.once('test', function (test) {
        clearTimeout(timeout)
        t.equal(test.statusCode, 0,                'test was success')
        t.equal(test.commit.repo, 'good-test.git', 'commit.repo is good-test.git')
    })

    spawn(__dirname + '/push-good-test.sh', [
        'http://127.0.0.1:' + server.address().port + '/good-test.git'
    ]).stdout.pipe(process.stdout)
})

test('push bad test', function (t) {
    t.plan(2)
    var timeout = setTimeout(t.end.bind(t), 5000)

    ci.once('test', function (test) {
        clearTimeout(timeout)
        t.ok(test.statusCode > 0,                 'test failed')
        t.equal(test.commit.repo, 'bad-test.git', 'commit.repo is bad-test.git')
    })

    spawn(__dirname + '/push-bad-test.sh', [
        'http://127.0.0.1:' + server.address().port + '/bad-test.git'
    ]).stdout.pipe(process.stdout)
})

test('push bad install', function (t) {
    t.plan(2)
    var timeout = setTimeout(t.end.bind(t), 5000)

    ci.once('install', function (install) {
        clearTimeout(timeout)
        t.ok(install.statusCode > 0,                    'install was failure')
        t.equal(install.commit.repo, 'bad-install.git', 'commit.repo is bad-install.git')
    })

    spawn(__dirname + '/push-bad-install.sh', [
        'http://127.0.0.1:' + server.address().port + '/bad-install.git'
    ]).stdout.pipe(process.stdout)
})

test('teardown', function (t) {
    server.close(t.end.bind(t))
})
