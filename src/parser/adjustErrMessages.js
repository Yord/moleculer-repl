const adjustErrMessages = ({ errs, opts }) => {
  const errs2 = []

  for (let i = 0; i < errs.length; i++) {
    const err = errs[i]

    switch (err.code) {
      case 'RequiredOptionMissing': {
        const err2 = {
          ...err,
          msg: 'Missing required argument.'
        }
        errs2.push(err2)
        break
      }
      case 'ValueRestrictionsViolated': {
        const {key, values, only} = err.info
        const err2 = {
          ...err,
          msg: `The '${key}' field cannot be '${values.join(' ')}'. Choose one of the following:\n  ${only.join(', ')}`
        }
        errs2.push(err2)
        break
      }
      default: {
        errs2.push(err)
      }
    }
  }

  return { errs: errs2, opts }
}

module.exports = {
  adjustErrMessages
}