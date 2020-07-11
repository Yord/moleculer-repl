module.exports = function replSelector(broker, replConfigs) {
    // For legacy purposes
    if (!replConfigs) {
        replConfigs = {
            type: 'vorpal',
            options: {
                delimiter: 'mol',
                customCommands: null
            }
        }
    }

    if (replConfigs.type == 'vorpal') {
        const repl = require('./vorpal-repl')
        return repl(broker, replConfigs.options)
    }

    const repl = require('./shargs-repl')
    return repl(broker, replConfigs.options)
}

