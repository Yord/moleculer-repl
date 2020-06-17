const adjustErrMessages = ({ errs, opts }) => {
  const errs2 = []

  for (let i = 0; i < errs.length; i++) {
    const err = errs[i]

    if (err.code === 'RequiredOptionMissing') {
      const err2 = {
        ...err,
        msg: 'Missing required argument.'
      }
      errs2.push(err2)
    } else {
      errs2.push(err)
    }
  }

  return { errs: errs2, opts }
}

module.exports = {
  adjustErrMessages
}