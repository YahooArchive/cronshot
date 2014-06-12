var cronshot = require('./src/cronshot'),
  middleware = {
    'local': require('./saveMiddleware/local'),
    'graphicsmagick': require('./saveMiddleware/graphicsmagick'),
    'mobstor': require('./saveMiddleware/mobstor')
  };

// Mobstor example
cronshot.startCapturing({
  'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
  'saveMiddleware': [
  {
    'name': 'graphicsmagick',
    'middleware': middleware.graphicsmagick,
    'options': {
      'path': __dirname
    }
  }, {
    'middleware': middleware.mobstor,
    'options': {
      'host': 'playground.yahoofs.com',
      'path': '/gfranko/'
    }
  }]
});

// {
//     'name': 'local',
//     'middleware': middleware.local,
//     'options': {
//       'path': __dirname
//     }
// },

// Save Local File Example
// cronshot.startCapturing({
//   'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
//   'path': __dirname,
//   'saveMiddleware': require('./saveMiddleware/local')
// });