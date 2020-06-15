const {lexerSync, parserSync} = require('shargs')
const {restrictToOnly} = require('shargs-parser')
const {strToArgv} = require('./strToArgv')

const lexer = lexerSync({
  toArgv,
  opts: [restrictToOnly]
})

const parser = cmd => rawCommand => parserSync({
  toArgv,
  opts: [restrictToOnly],
  fromArgs: fromArgs(rawCommand)
})(cmd)(rawCommand)

module.exports = {
  lexer,
  parser
}

function toArgv (str) {
  return {
    errs: [],
    argv: strToArgv(str)
  }
}

function fromArgs (rawCommandNewline) {
  const rawCommand = rawCommandNewline.replace('\n', '')

  const addRawCommand = cmd => (
    Object
    .entries(cmd)
    .map(([key, obj]) => [key, {...obj, rawCommand}])
    .reduce((obj, [key, val]) => ({...obj, [key]: val}), {})
  )

  return ({errs, args}) => ({
    errs,
    args: typeof args[1] === 'undefined' ? args[0] : {...addRawCommand(args[1]), _: args[0]._}
  })
}