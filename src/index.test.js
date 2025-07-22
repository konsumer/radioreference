import { describe, test } from 'node:test'
import radioreference from './index.js'

describe('Radio Reference', () => {
  test('Portland: 97239', async ({ assert }) => {
    const r = await radioreference(97239)
    // console.log(r.ctid, r.frequencies)

    assert.equal(r.zip, 97239)
    assert.equal(r.ctid, 2230)

    // these may change!
    assert.equal(r.frequencies.length, 17)
    assert.deepEqual(r.frequencies[0], {
      group: 'Multnomah County',
      subgroup: 'Multnomah County',
      scid: 2068,
      frequency: 46.58,
      license: 'WPEI422',
      type: 'BM',
      tone: null,
      alpha: 'Portland Civ Def',
      description: 'Portland Civil Defense',
      mode: 'FM',
      tag: 'Emergency Ops'
    })
    assert.deepEqual(r.frequencies[16], {
      group: 'Education',
      subgroup: 'Concordia University',
      scid: 81064,
      frequency: 152.9225,
      license: null,
      type: 'RM',
      tone: '351 DPL',
      alpha: 'Concordia U Sec',
      description: 'Security Dispatch',
      mode: 'FMN',
      tag: 'Security'
    })
  })
})
