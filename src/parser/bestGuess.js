const {traverseOpts} = require('shargs-parser')

const bestGuess = traverseOpts(isSubcommandWithValues)(cmd => {
  const values = bestGuessValues(cmd.values)
  return {opts: [{...cmd, values}]}
})

module.exports = {
  bestGuess
}

function bestGuessValues (opts) {
  const opts2 = []

  const posArgs = []

  for (const opt of opts) {
    if (opt.bestGuess) {
      const values = opt.values

      if (Array.isArray(values)) {
        let at  = 0
        let arg = values[at]
  
        while (arg) {
          if (isOption(arg)) {
            const key = arg.slice(isShortOption(arg) ? 1 : 2)
  
            const arg2 = values[at + 1]
  
            if (arg2) {
              if (isValue(arg2)) {
                const str = {key, types: ['string'], args: [], values: [arg2]}
                opts2.push(str)
                at += 1
              } else {
                const not = key.startsWith('no-')
                const key2 = key.slice(3)

                const flg = {key: not ? key2 : key, types: [], args: [], values: [not ? -1 : 1]}
                opts2.push(flg)
              }
            } else {
              const not = key.startsWith('no-')
              const key2 = key.slice(3)

              const flg = {key: not ? key2 : key, types: [], args: [], values: [not ? -1 : 1]}
              opts2.push(flg)
            }
          } else {
            posArgs.push(arg)
          }
  
          at += 1
          arg = values[at]
        }
      }
    } else {
      opts2.push(opt)
    }
  }

  let at    = 0
  let value = posArgs[at]

  while (value) {
    const index = opts2.findIndex(isUnusedNonVariadicPosArg)
    if (index === -1) break

    const posArg = opts2[index]

    const length = posArg.types.length
    const values = [value, ...posArgs.slice(0, length - 1)]
    if (values.length !== length) break

    opts2[index] = {...posArg, values}

    at += length
    value = posArgs[at]
  }

  return opts2
}

function isSubcommandWithValues ({key, args, opts, values}) {
  return key !== 'options' && Array.isArray(args) && Array.isArray(opts) && Array.isArray(values)
}

function isOption (arg) {
  return isLongOption(arg) || isShortOption(arg)
}

function isShortOption (arg) {
  return arg.length === 2 && arg[0] === '-' && arg[1] !== '-'
}

function isLongOption (arg) {
  return arg.length > 2 && arg[0] === '-' && arg[1] === '-' && arg[2] !== '-'
}

function isValue (arg) {
  return arg.length > 0 && arg[0] !== '-'
}

function isUnusedNonVariadicPosArg ({key, args, types, values}) {
  return (
    typeof key === 'string' &&
    Array.isArray(types) && types.length > 0 &&
    typeof args === 'undefined' &&
    typeof values === 'undefined'
  )
}