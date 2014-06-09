var cronshot = require('./cronshot');

// capture with default options
// cronshot.startCapturing();

// capture with custom options
cronshot.startCapturing({
  // url: 'http://www.yahoo.com',
  customCSS: '.js-applet-view-container-main { background: red !important; }'
});
