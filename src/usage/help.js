const { desc, note, optsFilter, optsList, space, synopsis, usage } = require('shargs-usage');
const {onlyOptions} = require('./onlyOptions')
const {onlyPosArgs} = require('./onlyPosArgs')

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

const commandUsage = (opt) => help(opt)(style)

function wrapper(broker, cmd, args, errs, handler) {
  	// Check for errs and show the command usage
	if (errs.length > 0) {
		const errStr = errs.map(err => err.msg).join('\n')
		console.log(`\n  ${errStr}\n\n${commandUsage(cmd)}`)
		return
	}

	// Show command usage details
	if (args.options.help)
		return console.log(`\n${commandUsage(cmd)}`)

  return handler(broker, cmd, args, errs)
}

module.exports = {
  commandUsage,
  wrapper
}