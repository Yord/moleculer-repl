const {fromArgs: fromArgsDefault, lexerSync, parserSync} = require('shargs')
const {arrayOnRepeat, bestGuessCast, equalsSignAsSpace, flagsAsBools, restrictToOnly, requireOpts} = require('shargs-parser')
const {adjustErrMessages} = require('./adjustErrMessages')
const {bestGuess} = require('./bestGuess')
const {groupOptions} = require('./groupOptions')
const {nestKeys} = require('./nestKeys')
const {removeRest} = require('./removeRest')
const {strToArgv} = require('./strToArgv')

const lexer = lexerSync({
  toArgv,
  opts: [restrictToOnly]
})

const parser = cmd => rawCommand => parserSync({
  toArgv,
  argv: [equalsSignAsSpace],
  opts: [requireOpts, restrictToOnly, bestGuess, groupOptions, arrayOnRepeat, adjustErrMessages],
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

  return ({errs, args: [opts, cmd, ...rest]}) => {
    const res = fromArgsDefault({errs, args: [opts, addRawCommand(cmd), ...rest]})

    const {errs: errs2, args: args2} = removeRest(res)

    return {
      errs: errs2,
      args: {...args2, rawCommand}
    }
  }
}