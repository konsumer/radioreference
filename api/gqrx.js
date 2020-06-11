const { gqrx, radioreference } = require('../src/index')

module.exports = (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="bookmarks.csv"')
  radioreference(req.query.zip).then(gqrx).then(res.send)
}