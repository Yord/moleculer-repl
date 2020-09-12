const { desc, note, optsFilter, optsList, space, synopsis, usage, br } = require('shargs-usage');
const {onlyOptions} = require('./onlyOptions')
const {onlyPosArgs} = require('./onlyPosArgs')

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const help = opt => optsFilter(opt => opt.key !== 'customOptions')(
  opt => () => {
    const maxWidth = 80

    const maxLength = computeMaxOptDescLength(opt)

    const style = {
      line: [{ padStart: 2, width: 80 - 2 }],
      cols: [{ padStart: 4, padEnd: 1, width: maxLength }, { width: maxWidth - maxLength - 5 }]
    }

    return usage([
      onlyPosArgs(
        opt => synopsis({ ...opt, key: `  Usage: ${opt.key} [options]` })
      ),
      space,
      desc,
      space,
      note('Options:'),
      space,
      onlyOptions(
        optsList
      )
    ])(opt)(style)
  }
)(opt)()

/**
 * Given a command prints help about it
 * @param {Opt} cmd Sharg's sub command
 */
const commandUsage = (cmd) => help(cmd)

/**
 * Handles error checking and shows help
 * 
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 * @param {Function} handler Command handler
 * @param {Object?} helpers Object containing helpers
 * @returns {Function}
 */
function wrapper(broker, cmd, args, errs, handler, helpers) {
  // Show command usage details
	if (args.options.help)
    return console.log(`\n${commandUsage(cmd)}`)

  // Check for errs and show the command usage
	if (errs.length > 0) {
		const errStr = errs.map(err => err.msg).join('\n')
		console.log(`\n  ${errStr}\n\n${commandUsage(cmd)}`)
		return
	}

  return handler(broker, args, helpers)
}

module.exports = {
  commandUsage,
  wrapper
}

function computeMaxOptDescLength (cmd) {
  function valuesLabel ({descArg, types, only = []}, equalsSign) {
    const value = (
      typeof descArg === 'string'            ? descArg :
      Array.isArray(only) && only.length > 0 ? only.join('|') :
      Array.isArray(types)                   ?
      types.length === 1                     ? types[0] :
      types.length > 1                       ? types.join(' ')
                                             : ''
                                             : ''
    )
  
    if (value === '') return ''
  
    return (equalsSign ? '=' : ' ') + '<' + value + '>'
  }

  function sortArgs (args) {
    const singleDash = []
    const doubleDash = []
    const others     = []
  
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      if (arg.startsWith('--'))     doubleDash.push(arg)
      else if (arg.startsWith('-')) singleDash.push(arg)
      else                          others.push(arg)
    }
  
    return {singleDash, others, doubleDash}
  }

  function listArgs (opt) {
    const {singleDash, others, doubleDash} = sortArgs(opt.args || [])
    const commaList = [...singleDash, ...others, ...doubleDash].join(', ')
    return commaList + valuesLabel(opt, doubleDash.length > 0)
  }

  let descs = []

  for (const opt of (cmd.opts || [])) {
    if (opt.args) {
      const desc = listArgs(opt)
      const opts = desc.split(' ')
      descs = [...descs, ...opts]
    }
  }

  const lengths = descs.map(desc => desc.length)
  const maxLength = lengths.reduce((max, length) => Math.max(max, length), 0)
  return maxLength
}