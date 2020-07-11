module.exports = function replSelector(broker, replConfigs) {
    if (replConfigs.type == 'vorpal') {
        const repl = require('./vorpal-repl')
        return repl(broker, replConfigs.options)
    }

    const repl = require('./shargs-repl')
    return repl(broker, replConfigs.options)
}

