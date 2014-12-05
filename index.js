var cicada = require('cicada')

module.exports = function demeter (options) {
    var ci = cicada(options.dir)
    ci.on('commit', function (commit) {
        var installOut = '', install = commit.spawn('npm', ['install']).on('exit', function (code) {
            if (code) {
                return ci.emit('install', {statusCode: code, output: installOut, commit: commit})
            }
            ci.emit('install', {statusCode: code, output: installOut, commit: commit})
            var testOut = '', test = commit.run('test').on('exit', function (code) {
                ci.emit('test', {statusCode: code, output: testOut, commit: commit})
            })
            function appendTestOut (data) { testOut += data }
            test.stdout.on('data', appendTestOut)
            test.stderr.on('data', appendTestOut)
        })
        function appendInstallOut (data) { installOut += data }
        install.stdout.on('data', appendInstallOut)
        install.stderr.on('data', appendInstallOut)
    })

    return ci
}
