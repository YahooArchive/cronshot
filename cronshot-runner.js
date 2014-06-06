var cronshot = require('./cronshot');

cronshot.startCapturing(null);
cronshot.startCapturing({
  url: 'http://www.yahoo.com',
  imageName: 'yahoo.png',
  mobstorePath: 'yahoo.png' 
});
