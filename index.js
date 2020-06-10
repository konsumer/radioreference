const https = require('follow-redirects').https
const cheerio = require('cheerio')

const camelize = str => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

const get = url => new Promise((resolve, reject) => {
  https.get(url, (response) => {
    let body = ''
    response.on('data', (chunk) => body += chunk)
    response.on('end', () => resolve(body))
  }).on('error', reject)
})

module.exports = async zip => {
  const out = []
  const $ = cheerio.load(await get(`https://www.radioreference.com/apps/db/?action=searchZip&from=db&zip=${zip}`))
  $('table.w1p.rrtable').each((i, table) => {
    const $table = $(table)
    const category = $table.parent().prev().prev().text().trim()
    const headers = $('th', $table).map((i, th) => $(th).text().trim())

    $('tr', $table).each((i, tr) => {
      const row = {}
      $('td', tr).map((i, td) => {
        row[camelize(headers[i])] = $(td).text().trim()
      })
      if (row.frequency) {
        row.frequency = Number(row.frequency)
        row.category = category
        if (row.tone === '') {
          delete row.tone
        }
        out.push(row)
      }
    })
  })
  return out
}
