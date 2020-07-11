module.exports = function replSelector(broker, replConfigs) {
    // For legacy purposes
    if (!replConfigs.type) {
        const legacy = {
            type: 'vorpal',
            options: {
                delimiter: replConfigs.delimiter,
                customCommands: replConfigs.customCommands
            }
        }
        replConfigs = legacy
    }

    if (replConfigs.type == 'vorpal') {
        const repl = require('./vorpal-repl')
        return repl(broker, replConfigs.options)
    }

    const repl = require('./shargs-repl')
    return repl(broker, replConfigs.options)
}

