cronshot.js
===========

Node module that allows you to schedule cron jobs to take, alter, and store web page screenshots

## How

cronshot.js uses:

- A custom fork of [node-webshot](https://github.com/brenden/node-webshot) to take screenshots using [Phantom JS](https://github.com/ariya/phantomjs)

- [node-cron](https://github.com/ncb000gt/node-cron) to schedule screenshots

- [mobstor](http://devel.corp.yahoo.com/ynodejs/mobstor/Client.html) to store screenshots on mobstor

- [gm](https://github.com/aheckmann/gm) to programatically use [ImageMagick](http://www.imagemagick.org/) to manipulate the screenshots


## Quick Start

* **Install PhantomJS**
 - Make sure you have [homebrew](http://brew.sh/) installed: `ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"`
 - Install PhantomJS: `brew update && brew install phantomjs`

* **Install ImageMagick**

 - `brew update && brew install imagemagick`


* **Install local dependencies**
 - `ynpm install`


* **Run the example `cronshot-runner.js`**
 - `node cronshot-runner.js`


## Examples

**Passing Options via Code**

```javascript
var cronshot = require('./src/cronshot');

// Image Magick and Mobstor Screenshot Example
// -------------------------------------------

// Takes a screenshot of a TD applet,
// converts the screenshot to be a transparent image using Image Magick,
// and stores the transparent image on Mobstor

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

// Save Local File Example
// -----------------------

// Takes a screenshot of a TD applet,
// and saves the screenshot in the current local directory
cronshot.startCapturing({
  'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
  'path': __dirname,
  'saveMiddleware': require('./saveMiddleware/local')
});
```

**Passing Options via Command Line**

`node cronshot-runner.js --customCSS 'body { background: blue !important; }' --url 'http://google.com'`

**Note:** You can pass BOTH **code options** AND **command line options**. If you pass the same option via both methods, the command line option takes precedence.

## Middleware

The `saveMiddleware` option accepts a function that can be used to manipulate/save a screenshot image.

Below are the current middleware functions available:

`imagemagick` - Converts a screenshot to a transparent image

`mobstor` - Saves to the Yahoo! Mobstor Cloud

`local` - Saves to the local file system

To see examples of how to write your own `saveMiddleware` adapter, look in the **saveMiddleware** folder.

## Options

```javascript
// The time to fire off your job. This can be in the form of cron syntax or a JS Date object.
// The default runs every 10 seconds
'cronPattern': '*/10 * * * * *',
// The webpage URL that you would like to take a screenshot of
'url': '',
// The name of the image you would like to be saved
'imageName': 'screenshot.png',
// Whether or not you would like to save a copy of the screenshot image locally
'saveImageLocally': false,
// The base host that you would like to save to
'host': '',
// the path that you would like to save to
'path': '',
// User agent to use when creating the screenshot
'userAgent': '',
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
// Only applicable if the customCSS option is used
// Will wait until every DOM element, that has a customCSS rule associated with it, is on the page
'waitForCustomCSS': true,
// Only applicable if the customCSS option is used
// Will wait x milleseconds inbetween tries to find customCSS associated DOM elements
'waitForCustomCSSDelay': 2000,
// Only applicable if the customCSS option is used
// Will try x times to find a customCSS associated DOM element
'waitForCustomCSSTimeout': 5,
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
'errorIfStatusIsNot200': false
```

## Contributors

- Greg Franko
- Chase West
- Akshay Patel