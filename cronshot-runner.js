var cronshot = require('./cronshot');

// capture with default options
cronshot.startCapturing(null);

// capture with custom options
cronshot.startCapturing({
  url: 'http://www.yahoo.com',
  imageName: 'yahoo.png',
  mobstorPath: 'yahoo.png' 
});
