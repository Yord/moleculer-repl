const {optsFilter} = require('shargs-usage')

const onlyOptions = optsFilter(
  ({key, args, opts} = {}) => (
    typeof key !== 'undefined' &&
    Array.isArray(args) &&
    !Array.isArray(opts)
  )
)

module.exports = {
  onlyOptions
}