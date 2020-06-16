const {traverseArgs} = require('shargs-parser')

const removeRest = traverseArgs({
  array: ({key, val, errs, args}) => {
    const {[key]: _, ...rest} = args

    return {
      errs,
      args: {
        ...rest,
        ...(key === '_' ? {} : {[key]: val})
      }
    }
  }
})

module.exports = {
  removeRest
}