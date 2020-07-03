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

module.exports = {
  commandUsage
}