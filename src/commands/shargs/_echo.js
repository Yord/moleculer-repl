const {subcommand, stringPos } = require('shargs-opts')
// const {desc, optsDef, optsLists, space, synopsis, usage} = require('shargs-usage')

const echoCmd = subcommand([
  stringPos('text', {desc: 'This text is echoed.', descArg: 'TEXT'})
])

function echoF (broker, args) {
  const { text } = args
  return broker.logger.info({text})
}

module.exports = function(commands, broker) {
  return echoCmd(
      'echo', // Name
      ['echo', '--e'], // Alias 
      {
          action: (args) => echoF(broker, args), // Handler
          desc: 'Echos a string.' // Description
    })
}