cronshot.js
===========

Node module that allows you to schedule cron jobs to take and store web page screenshots

## How

cronshot.js uses:

- A custom fork of [node-webshot](https://github.com/brenden/node-webshot) to take screenshots using [Phantom JS](https://github.com/ariya/phantomjs)
- [node-cron](https://github.com/ncb000gt/node-cron) to schedule screenshots
- [mobstor](http://devel.corp.yahoo.com/ynodejs/mobstor/Client.html) to store the screenshots on mobstor


## Quick Start

* **Install PhantomJS**
 - Make sure you have [homebrew](http://brew.sh/) installed: `ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"`
 - Install PhantomJS: `brew update && brew install phantomjs`


* **Install local dependencies**
 - `ynpm install`


* **Run the example `cronshot-runner.js`**
 - `node cronshot-runner.js`


## Examples

**Passing Options via Code**

```javascript
var cronshot = require('./cronshot');

cronshot.run({
	'customCSS': 'body { background: blue !important; }'
});
```

**Passing Options via Command Line**

`node cronshot-runner.js --customCSS 'body { background: blue !important; }'`

**Note:** You can pass BOTH code options and command line options. If you pass the same option via both methods, the command line option(s) take precedence.

## Options

```javascript
// The dimensions of the browser window
'screenSize': {
	'width': 1024,
	'height': 768
},
//The area of the page document, starting at the upper left corner, to render.
// Possible values are 'screen', 'all', and a number defining a pixel length.
// 'window' causes the length to be set to the length of the window
// (i.e. the shot displays what is initially visible within the browser window). 
// 'all' causes the length to be set to the length of the document along the given dimension.
'shotSize': {
	'width': 'window',
	'height': 'window'
},
// The left and top offsets define the upper left corner of the screenshot rectangle.
// The right and bottom offsets allow pixels to be removed from the shotSize dimensions
// (e.g. a shotSize height of 'all' with a bottom offset of 30 would cause all but the
// last 30 rows of pixels on the site to be rendered).
'shotOffset': {
	'left': 0,
	'right': 0,
	'top': 0,
	'bottom': 0
},
// The location of phantomjs.
// Webshot tries to use the binary provided by the phantomjs NPM module,
// and falls back to 'phantomjs' if the module isn't available.
'phantomPath': 'phantomjs',
// Object with key value pairs corresponding to phantomjs command line options.
'phantomConfig': {},
// Any additional headers to be sent in the HTTP request.
'customHeaders': null,
// When taking the screenshot, adds a white background if not defined elsewhere
'defaultWhiteBackground': true,
// When taking the screenshot, adds custom CSS rules if defined
'customCSS': '',
// JPEG compression quality.
// A higher number will look better, but creates a larger file.
// Quality setting has no effect when streaming.
'quality': 75,
// If streaming is used, this designates the file format of the streamed rendering.
// Possible values are 'png', 'jpg', and 'jpeg'.
'streamType': 'png',
// Indicates whether the content needs to be requested ('url'),
// loaded locally ('file'),
// or is being provided directly as a string ('html').
'siteType': 'url',
// Number of milliseconds to wait after a page loads before taking the screenshot.
'renderDelay': 0,
// Number of milliseconds to wait before killing the phantomjs process and assuming
// webshotting has failed. (0 is no timeout.)
'timeout': 0,
// Wait for the web page to signal to webshot when to take the photo using
// window.callPhantom('takeShot');
'takeShotOnCallback': false,
// If the loaded page has a non-200 status code, don't take a screenshot, cause an error instead.
'errorIfStatusIsNot200': false,
// The time to fire off your job. This can be in the form of cron syntax or a JS Date object.
'cronPattern': '*/10 * * * * *',
// The webpage URL that you would like to take a screenshot of
'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
// The name of the image you would like to be saved
'imageName': 'screenshot.png',
// The base host that you would like to save to
'host': 'playground.yahoofs.com',
// the mobster path that you would like to save to
'mobsterPath': '/gfranko/screenshot.png'
```

## Contributors

- Greg Franko
- Chase West
- Akshay Patel