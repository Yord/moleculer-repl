const {subcommand} = require('shargs-opts')
const {traverseOpts} = require('shargs-parser')

const groupOptions = traverseOpts(isSubcommandWithValues)(cmd => {
  const opts = cmd.values.filter(isOptionWithValues)
  const rest = cmd.values.filter(isRest)
  const others = cmd.values.filter(opt => !isOptionWithValues(opt) && !isRest(opt))

  const optionsCmd = subcommand(opts)('options', ['options'], {values: [...opts, ...rest]})
  const cmd2 = {...cmd, opts: [...others, optionsCmd], values: [...others, optionsCmd]}

  return {opts: [cmd2]}
})

module.exports = {
  groupOptions
}

function isSubcommandWithValues ({key, args, opts, values}) {
  return key !== 'options' && Array.isArray(args) && Array.isArray(opts) && Array.isArray(values)
}

function isOptionWithValues ({key, args, opts, values}) {
  return typeof key === 'string' && Array.isArray(args) && typeof opts === 'undefined' && Array.isArray(values)
}

function isRest ({key, values}) {
  return typeof key === 'undefined' && Array.isArray(values) && values.length === 1
}