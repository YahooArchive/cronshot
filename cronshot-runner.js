var cronshot = require('./src/cronshot'),
  middleware = {
    'local': require('./saveMiddleware/local'),
    'imagemagick': require('./saveMiddleware/imagemagick')
  };

// Image Magick and Mobstor example
// cronshot.startCapturing({
//   // The URL of the website to take a screenshot of
//   'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
//   // Where to save the screen shot locally
//   'path': __dirname,
//   //'customCSS' : '.js-applet { background: #ABC; transition: none; -webkit-transition: none; }',
//   // Our middleware modules
//   'saveMiddleware': [{
//     // Function that does all the Image Magick stuff
//     'middleware': middleware.imagemagick,
//     'options': {
//       'gmCommands': [{
//         'method': 'trim',
//         'args': []
//       }, {
//         'method': 'channel',
//         'args': ["Opacity"]
//       }, {
//         'method': 'fill',
//         'args': ["rgba(255, 255, 255, 0.2)"]
//       }, {
//         'method': 'opaque',
//         'args': ["#FFF"]
//       }, {
//         'method': 'quality',
//         'args': [100]
//       }]
//     }
//   }, {
//     'middleware': middleware.local,
//     'options': {
//       'path': __dirname
//     }
//   }]
// });

// Save Local File Example
cronshot.startCapturing({
  'url': 'http://yahoo.com',
  'path': __dirname,
  'cronPattern': '',
  'saveMiddleware': middleware.local,
  'customCSS': '* { whitespace: nowrap !important; }'
}, function(err) {
  if(err)
    console.error(err);
});
