const {traverseArgs} = require('shargs-parser')
const _ = require('lodash')

const nestKeys = traverseArgs({
  boolean: nestValue,
  flag: nestValue,
  number: nestValue,
  string: nestValue
})

module.exports = {
  nestKeys
}

function hasDots (key) {
  return key.indexOf('.') > -1
}

function nestValue ({key, val, errs, args}) {
  if (hasDots(key)) {
    const obj = {}
    _.set(obj, key, val)

    const {[key]: foo, ...rest} = args

    return {errs, args: {...rest, ...obj}}
  } else {
    return {errs, args}
  }
}