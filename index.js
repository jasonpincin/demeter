var http   = require('http'),
    cicada = require('cicada')

module.exports = function demeter (options) {
    var ci = cicada(options.repos)
    ci.on('commit', function (commit) {
        commit.run('test').on('exit', function (code) {
            var status = code === 0 ? 'PASSED' : 'FAILED';
            console.log(commit.hash, commit.repo, commit.branch, status)
        })
    })

    return ci
}
