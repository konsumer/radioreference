import { parse } from 'node-html-parser'

export function parsePage(body) {
  const doc = parse(body)
  const frequencies = []
  for (const subgroup of doc.querySelectorAll('.mb-3')) {
    const groupTitle = subgroup.querySelector('h4')?.text?.trim() || null
    const subgroupTitle = subgroup.querySelector('h5')?.text?.trim() || null
    const scid = subgroup.querySelector('a.anchor[id^="scid-"]')?.getAttribute('id')?.replace('scid-', '') || null
    const table = subgroup.querySelector('table')

    if (table) {
      for (const row of table.querySelectorAll('tr')) {
        const cells = row.querySelectorAll('td')
        if (cells.length >= 7) {
          const frequency = {
            group: groupTitle,
            subgroup: subgroupTitle,
            scid: scid ? parseInt(scid) : null,
            frequency: Number(cells[0]?.text?.trim() || 0) || null,
            license: cells[1]?.text?.trim() || null,
            type: cells[2]?.text?.trim() || null,
            tone: cells[3]?.text?.trim() || null,
            alpha: cells[4]?.text?.trim() || null,
            description: cells[5]?.text?.trim() || null,
            mode: cells[6]?.text?.trim() || null,
            tag: cells[7]?.text?.trim() || null
          }

          if (frequency.frequency) {
            frequencies.push(frequency)
          }
        }
      }
    }
  }
  return frequencies
}


export default async function radioreference(zip) {
  const r = await fetch('https://www.radioreference.com/db/search/', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: `zip=${zip}`,
    method: 'POST'
  })

  if (!r.redirected) {
    throw new Error('Not found.')
  }

  return {
    zip: parseInt(zip),
    ctid: parseInt(r.url.split('/').pop()),
    frequencies: await parsePage(await r.text())
  }
}
