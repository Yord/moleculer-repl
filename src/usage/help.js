const { desc, note, optsFilter, optsList, space, synopsis, usage, br } = require('shargs-usage');
const {onlyOptions} = require('./onlyOptions')
const {onlyPosArgs} = require('./onlyPosArgs')

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const help = optsFilter(opt => opt.key !== 'customOptions')(
  usage([
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
  ])
)

const style = {
  line: [{ padStart: 2, width: 78 }],
  cols: [{ padStart: 4, width: 20 }, { width: 56 }]
}

/**
 * Given a command prints help about it
 * @param {Opt} cmd Sharg's sub command
 */
const commandUsage = (cmd) => help(cmd)(style)

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