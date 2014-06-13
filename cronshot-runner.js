var cronshot = require('./src/cronshot'),
  middleware = {
    'local': require('./middleware/local'),
    'graphicsmagick': require('./middleware/graphicsmagick'),
    'mobstor': require('./middleware/mobstor')
  };

// Image Magick and Mobstor example
cronshot.startCapturing({
  // The URL of the website to take a screenshot of
  'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
  // Where to save the screen shot locally
  'path': __dirname,
  // Our middleware modules
  'saveMiddleware': [{
    // Function that does all the Image Magick stuff
    'middleware': middleware.graphicsmagick
  }, {
    // Function that does all of the mobstor stuff
    'middleware': middleware.mobstor,
    // Options overrides specific to this middleware
    'options': {
      // The Mobstor host URL
      'host': 'playground.yahoofs.com',
      // Our relative host path (where we are saving the screenshot on playground.yahoofs.com)
      'hostPath': '/gfranko/'
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