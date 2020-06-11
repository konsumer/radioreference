const { sdrtouch, radioreference } = require('../src/index')

module.exports = (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="SDRTouchPresets.xml"')
  radioreference(req.query.zip).then(sdrtouch).then(res.send)
}