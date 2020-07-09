const blacklist = ['ValueRestrictionsViolated']

const adjustErrMessages = compose(
  rephraseErrMessages,
  filterErrMessages(blacklist)
)

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

function filterErrMessages (blacklist) {
  return ({ errs, opts }) => ({
    errs: errs.filter(({code}) => !blacklist.includes(code)),
    opts
  })
}

function compose (f, g) {
  return a => f(g(a))
}