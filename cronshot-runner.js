var cronshot = require('./cronshot');

// capture with default options
// cronshot.startCapturing();

// capture with custom options
cronshot.startCapturing({
  // url: 'http://www.yahoo.com',
  url: 'http://www.yahoo.com',
  // renderDelay: 10000
  // customCSS: 'body { background: red !important }'
  customCSS: {
  	'.js-applet-view-container-main': 'background: blue !important'
  },
  takeShotOnCallback: true,
  script: function isPageReady() {
  	// var images = document.querySelectorAll('img'),
  	// 	x = -1,
  	// 	currentImage;

  	// while(++x < images.length) {
  	// 	currentImage = images[x];
  	// 	if(!currentImage.complete) {
  	// 		isPageReady();
  	// 	}
  	// }

  	// setTimeout(function() {
	  // 	console.log('document.querySelector(".js-applet-view-container-main")', document.querySelector(".js-applet-view-container-main"));

	  //   window.callPhantom('takeShot');
  	// }, 15000);
	console.log(document.querySelector(".js-applet-view-container-main"));
	if(document.querySelector(".js-applet-view-container-main")) {
		window.callPhantom('takeShot');
	} else {
		setTimeout(function() {
			isPageReady();
		}, 2000);
	}
  }
});
