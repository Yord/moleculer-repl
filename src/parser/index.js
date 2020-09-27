const {fromArgs: fromArgsDefault, parserSync} = require('shargs')
const {arrayOnRepeat, bestGuessCast, equalsSignAsSpace, flagsAsBools, requireOpts, suggestOpts} = require('shargs-parser')
const {adjustErrMessages} = require('./adjustErrMessages')
const {bestGuess} = require('./bestGuess')
const {groupOptions} = require('./groupOptions')
const {nestKeys} = require('./nestKeys')
const {removeRest} = require('./removeRest')
const {strToArgv} = require('./strToArgv')

const lexer = parserSync({
  toArgv,
  toArgs:   ({errs, opts}) => ({errs, args: opts}),
  fromArgs: ({errs, args}) => ({errs, opts: args})
})

const parser = cmd => rawCommand => parserSync({
  toArgv,
  argv: [equalsSignAsSpace],
  opts: [requireOpts, bestGuess, suggestOpts, groupOptions, arrayOnRepeat, adjustErrMessages],
  args: [flagsAsBools, bestGuessCast, nestKeys],
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

  const addRawCommand = (cmd = {}) => (
    Object
    .entries(cmd)
    .map(([key, obj]) => [key, {...obj, rawCommand}])
    .reduce((obj, [key, val]) => ({...obj, [key]: val}), {})
  )

  return ({errs, args: [opts, cmd, ...rest]}) => removeRest(
    fromArgsDefault({errs, args: [opts, addRawCommand(cmd), ...rest]})
  )
}