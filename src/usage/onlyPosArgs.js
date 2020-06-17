const {optsFilter} = require('shargs-usage')

const onlyPosArgs = optsFilter(
  ({key, args, opts} = {}) => (
    typeof key !== 'undefined' &&
    !Array.isArray(args) &&
    !Array.isArray(opts)
  )
)

module.exports = {
  onlyPosArgs
}