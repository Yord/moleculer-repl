const adjustErrMessages = obj => rephraseErrMessages(obj)

module.exports = {
  adjustErrMessages
}

function rephraseErrMessages ({ errs, opts }) {
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
      default: {
        errs2.push(err)
      }
    }
  }

  return { errs: errs2, opts }
}