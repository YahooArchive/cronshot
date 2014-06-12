var cronshot = require('./src/cronshot');

// Mobstor example
cronshot.startCapturing({
  'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
  'host': 'playground.yahoofs.com',
  'path': '/gfranko/',
  'saveMiddleware': require('./saveMiddleware/mobstor')
});

// Save Local File Example
// cronshot.startCapturing({
//   'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
//   'path': __dirname,
//   'saveMiddleware': require('./saveMiddleware/local')
// });