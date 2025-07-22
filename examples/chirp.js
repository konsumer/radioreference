#!/usr/bin/env node

// convert zip-listing from radio-reference to CHIRP CSV

import radioreference from '../src/index.js'

const [,,zip] = process.argv

if (!zip) {
  console.error('Usage: chirp <ZIPCODE>')
  process.exit(1)
}

// simple util to output single val for CSV
const fieldMap = v => v !== null && v !== undefined ? JSON.stringify(v) : ''

const { frequencies } = await radioreference(zip)

const defvals = {
  Location: 0,
  Name: 'Unknown',
  Frequency: 0.0,
  Duplex: null,
  Offset: 0.600000,
  Tone: null,
  rToneFreq: 88.5,
  cToneFreq: 88.5,
  DtcsCode: '023',
  DtcsPolarity: 'NN',
  RxDtcsCode: '023',
  CrossMode: 'Tone->Tone',
  Mode: 'Auto',
  TStep: 5.00,
  Skip: null,
  Power: '50W',
  Comment: 'No comment',
  URCALL: null,
  RPT1CALL: null,
  RPT2CALL: null,
  DVCODE: null
}

console.log(Object.keys(defvals).join(','))

let i = 0
for (const {subgroup, frequency, license, alpha, description, ...rest} of frequencies) {
  // TODO: I think I can figure out a lot more fields here (like use type/tone/mode) but this is enough for basic usage
  // console.error(rest)

  const newRec = {
    Location: i++,
    Name: `${license ? `${license} ` : ''}${alpha}`,
    Frequency: frequency,
    Comment: `${subgroup} - ${description}`
  }

  console.log(Object.values({...defvals, ...newRec}).map(fieldMap).join(','))
}

