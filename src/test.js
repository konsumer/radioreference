const { test } = require('zora')

const { radioreference, gqrx } = require('./index')

test('data', async t => {
  const results = await radioreference(97239)
  console.log(results)
  t.is(results.length > 20, true, 'found results for 97239')
})
