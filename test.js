const { test } = require('zora')

const radioreference = require('./index')

test('97239', async t => {
  const results = await radioreference(97239)
  t.is(results.length > 20, true, 'found results for 97239')
})
