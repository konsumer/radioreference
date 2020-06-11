const https = require('follow-redirects').https
const cheerio = require('cheerio')
const { camelize: camelizeOrig, tableize } = require('inflection')
const randomColor = require('randomcolor')

const camelize = str => camelizeOrig(str, true).replace(/ /g, '')

const get = url => new Promise((resolve, reject) => {
  https.get(url, (response) => {
    let body = ''
    response.on('data', (chunk) => body += chunk)
    response.on('end', () => resolve(body))
  }).on('error', reject)
})

// get data for a zip from radioreference.com
const radioreference = async zip => {
  const out = []
  const $ = cheerio.load(await get(`https://www.radioreference.com/apps/db/?action=searchZip&from=db&inputs=1&zip=${zip}`))
  const parents = []
  $('#editarea .title').each((i, e) => { parents.push($(e).text().trim()) })
  parents.forEach((parent, i) => {
    const $titlebox = $('#editarea .titlebox').get(i)
    const categories = []
    $('a b', $titlebox).each((i, e) => { categories.push($(e).text().trim()) })
    categories.forEach((category, c) => {
      $table = $('table.rrtable').get(c)
      const headers = $('th', $table).map((i, th) => $(th).text().trim())
      $('tr', $table).each((i, tr) => {
        const row = {}
        $('td', tr).map((i, td) => {
          row[camelize(headers[i])] = $(td).text().trim()
        })
        if (row.frequency) {
          row.frequency = Number(row.frequency)
          row.category = category
          row.parent = parent
          if (row.tone === '') {
            delete row.tone
          }
          out.push(row)
        }
      })
    })
  })
  return out
}

// get the modulation of the station in GQRX format
const gqrxGetMod = station => {
  switch (station.mode) {
    case 'FMN':
      return 'Narrow FM'
    case 'FM':
      return 'WFM (stereo)'
    default:
      return station.mode
  }
}

// get the bandwidth of the station in GQRX format
// TODO: not really sure about this value
const gqrxGetBandwidth = station => {
  return 10000
}

// get a color for a tag, with some predefined categories
const gqrxGetColor = tag => {
  if (tag.match(/fire/i)) {
    return randomColor({ hue: 'orange' })
  }
  if (tag.match(/police/i) || tag.match(/fbi/i)) {
    return randomColor({ hue: 'blue' })
  }
  if (tag.match(/school/i) || tag.match(/education/i)) {
    return randomColor({ hue: 'yellow' })
  }
  if (tag.match(/military/i) || tag.match(/army/i) || tag.match(/navy/i)) {
    return randomColor({ hue: 'green' })
  }
  return randomColor()
}

// convert to gqrx bookmark format
const gqrx = data => {
  const tags = [...new Set(data.map(i => `${i.parent} - ${i.category}`))]
  let out = '# Tag name                              ;  color\n'
  tags.forEach(tag => {
    out += `${tag.padEnd(40, ' ')}; ${gqrxGetColor(tag)}\n`
  })
  out += '\n# Frequency ; Name                     ; Modulation          ;  Bandwidth ; Tags\n'
  data.forEach(station => {
    out += `${String(parseInt(station.frequency * 1000000)).padEnd(10, ' ')}; ${station.description.padEnd(40, '')}; ${gqrxGetMod(station)}; ${gqrxGetBandwidth(station)}; ${station.parent} - ${station.category}\n`
  })
  return out
}

const sdrtouchFilters = {
  FM: 30000,
  FMN: 15000,
  AM: 75000
}

const sdrtouchDems = {
  FM: 0,
  FMN: 1,
  AM: 2
}

let staticIndex = 0

// convert to sdrtouch bookmark format
const sdrtouch = data => {
  const tags = [...new Set(data.map(i => i.category))]
  let out = '<?xml version="1.0" encoding="UTF-8"?><sdr_presets version="1">'
  tags.forEach(category => {
    out += `<category id="${staticIndex++}" name="${category}">`
    out += data.filter(s => s.category === category).map((s, r) => {
      const freq = parseInt(s.frequency * 1000000)
      return `<preset id="${staticIndex++}" name="${s.description.trim()}" freq="${freq}" centfreq="${freq}" offset="0" order="${r + 1}" filter="${sdrtouchFilters[s.mode] || 30000}" dem="${sdrtouchDems[s.mode] || 0}" />`
    }).join('\n')
    out += '</category>'
  })
  out += '</sdr_presets>'
  return out
}

module.exports = {
  radioreference,
  gqrx,
  sdrtouch
}
