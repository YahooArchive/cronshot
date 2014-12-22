CronShot
========

Node module that allows you to schedule, take, alter, and store web page screenshots

`npm install cronshot`

## How

CronShot uses:

- [node-webshot](https://github.com/brenden/node-webshot) to take screenshots using [Phantom JS](https://github.com/ariya/phantomjs)

- [node-cron](https://github.com/ncb000gt/node-cron) to schedule screenshots

- [async](https://github.com/caolan/async) to allow more than one screenshot cron job to be run in parallel


## Setup

* **Install PhantomJS**
 - Make sure you have [homebrew](http://brew.sh/) installed: `ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"`

 - Install PhantomJS: `brew update && brew install phantomjs`

* **Install CronShot**
 - `npm install cronshot`

* **Install/Create any CronShot [middleware functions](#save-middleware) that you want**

* **Run CronShot using one of the examples below**


## Examples

**Take and Save An Image To The Local Filesystem One Time**

`npm install cronshot-local`

```javascript
var cronshot = require('cronshot'),
  middleware = {
    'local': require('cronshot-local')
  };

// Local File Example
// ------------------

// Takes a screenshot of sports.yahoo.com,
// and saves the screenshot to the local file system

// Save Local File Example
cronshot.startCapturing({
  // The webpage URL that you would like to take a screenshot of
  'url': 'http://sports.yahoo.com',
  // The local path where you would like to save the image
  'path': __dirname,
  // Only takes one screenshot
  'cronPattern': false,
  // What middleware functions to use each time a screenshot is taken
  'saveMiddleware': [middleware.local]
}, function(err) {
  // optional callback function once all screenshots have been taken
  if (err) {
      console.error(err);
  }
});
```

**Take and Save a Transparent Screenshot**

`npm install cronshot-imagemagick`

`brew update && brew install imagemagick`

```javascript
var cronshot = require('cronshot'),
  middleware = {
    'imagemagick': require('cronshot-imagemagick')
  };

// Image Magick Example
// --------------------

// Takes a screenshot of sports.yahoo.com,
// and converts the screenshot to be a transparent image using Image Magick

// Image Magick example
cronshot.startCapturing({
  // The webpage URL that you would like to take a screenshot of
  'url': 'http://sports.yahoo.com',
  // The local path where you would like to save the image
  'path': __dirname,
  // Only takes one screenshot
  'cronPattern': false,
  // What middleware functions to use each time a screenshot is taken
  'saveMiddleware': [{
    // Function that does all the Image Magick stuff
    'middleware': middleware.imagemagick,
    'options': {
      'gmCommands': [{
        'method': 'trim',
        'args': []
      }, {
        'method': 'transparent',
        'args': ['#FFFFFF']
      }]
    }
  }]
}, function(err) {
  // optional callback function once all screenshots have been taken
});
```

**Take and Save A Screenshot To The Local Filesystem Every 10 seconds**

`npm install cronshot-local`

```javascript
var cronshot = require('cronshot'),
  middleware = {
    'local': require('cronshot-local')
  };

// Local File Example
// ------------------

// Takes a screenshot of sports.yahoo.com,
// and saves the screenshot to the local file system

// Save Local File Example
cronshot.startCapturing({
  // The webpage URL that you would like to take a screenshot of
  'url': 'http://sports.yahoo.com',
  // The local path where you would like to save the image
  'path': __dirname,
  // Cron pattern to run every 10 seconds
  'cronPattern': '*/10 * * * * *',
  // What middleware functions to use each time a screenshot is taken
  'saveMiddleware': [middleware.local],
}, function(err) {
  // optional callback function once all screenshots have been taken
  if (err) {
      console.error(err);
  }
});
```

**Run One Or More Cron Jobs In Parallel**

`npm install cronshot-local`

```javascript
var cronshot = require('cronshot'),
  middleware = {
    'local': require('cronshot-local')
  };

// Takes a screenshot of sports.yahoo.com and yahoo.com,
// and saves both screenshots in the current local directory
cronshot.startCapturing({
  'parallelLimit': 2,
  'screenshots': [{
    // The webpage URL that you would like to take a screenshot of
    'url': 'http://sports.yahoo.com',
    // The local path where you would like to save the image
    'path': __dirname,
    // The desired name of the image (the default is screenshot.png)
    'imageName': 'screenshot.png',
    // What middleware functions to use each time a screenshot is taken
    'saveMiddleware': [middleware.local]
  }, {
    // The webpage URL that you would like to take a screenshot of
    'url': 'http://yahoo.com',
    // The local path where you would like to save the image
    'path': __dirname,
    // The desired name of the image (the default is screenshot.png)
    'imageName': 'screenshot1.png',
    // What middleware functions to use each time a screenshot is taken
    'saveMiddleware': [middleware.local]
  }]
}, function(err) {
  // optional callback function once all screenshots have been taken
  if (err) {
      console.error(err);
  }
});
```

**Passing Options via Command Line**

`node cronshot-runner.js --customCSS 'body { background: blue !important; }' --url 'http://yahoo.com'`

**Note:** You can pass BOTH **code options** AND **command line options**. If you pass the same option via both methods, the command line option takes precedence.

## Save Middleware

The `saveMiddleware` option accepts one or more functions, that are run serially (in order), to manipulate/save a screenshot image.

### Available Save Middleware

Below are the current middleware functions available:

[cronshot-local](https://github.com/yahoo/cronshot-local) - Cronshot middleware to save images locally

[cronshot-imagemagick](https://github.com/yahoo/cronshot-imagemagick) - Cronshot middleware to manipulate and save images with ImageMagick


### Writing Your Own Save Middleware

### Best Practices

* Should be small (~100 or less of code)

* Should do one thing (eg. save to filesystem, manipulate image, save to cdn)

* Should call a callback function when completed


### Example

```javascript
module.exports = function(obj, callback) {
    var options = obj.options,
        content = obj.readStream,
        info = {
            'name': 'example-middleware'
        },
        error = false;

    callback(error, info);
}
```


### Review

Save middleware functions are only provided three things; the **user options**, the **screenshot read stream**, and the **callback function** to call when all actions are completed.  Please make sure to pass an `info` object, with the name of the middleware, to the callback function.  


## Options

```javascript
// The time to fire off your job. This can be in the form of cron syntax or a JS Date object.
// The default runs every 10 seconds
// If you set this to false, then CronShot will only take one screen shot
'cronPattern': '*/10 * * * * *',
// The webpage URL that you would like to take a screenshot of
'url': '',
// The name of the image you would like to be saved
'imageName': 'screenshot.png',
// The local path where you would like to save the image
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
// If you set this to true, then CronShot will not print out any success/error logs
'silent': false,
// The maximum number of times you would like your screenshot cron job to run
'max': false,
// The maximum number of screenshot cron jobs to run in parallel
// Note: This only applies if you are running more than one screenshot cron jobs
'parallelLimit': 5
```

## Contributing

Please send all PR's to the `dev` branch.

If your PR is a code change:

1.  Install all node.js dev dependencies: `npm install`
2.  Update the appropriate module inside of the `src/modules` directory.
3.  Add a unit test inside of `tests/unit/cronshot.js`.
4.  Verify that all tests are passing by running `npm test`.
5.  Send the PR!


## Credits

cronshot.js would not have been possible without the help/inspiration of the following libraries/awesome people:

 - [Brenden Kokoszka](https://github.com/brenden)'s [node-webshot](https://github.com/brenden/node-webshot)
  * Takes screenshots using [Phantom JS](https://github.com/ariya/phantomjs)
  * Copyright (c) Brenden Kokoszka, 2012 -  [MIT License](https://github.com/brenden/node-webshot#license)

 - [Nick Campbell](https://github.com/ncb000gt)'s [node-cron](https://github.com/ncb000gt/node-cron)
  * Schedules cron jobs
  * Copyright (c) Brenden Kokoszka, 2010 -  [MIT License](https://github.com/ncb000gt/node-cron#license)

 - [Caolan McMahon](https://github.com/caolan)'s [async](https://github.com/caolan/async)
  * Async utilities for node and the browser
  * Copyright (c) Caolan McMahon, 2010-2014 -  [MIT License](https://github.com/caolan/async/blob/master/LICENSE)


## Contributors

- [Greg Franko](https://github.com/gfranko)
- [Chase West](https://github.com/ChaseWest)
- [Akshay Patel](https://github.com/akshayp)
- [Kevin Ku](https://github.com/kku1993)
