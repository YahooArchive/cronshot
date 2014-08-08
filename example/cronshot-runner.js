/*jslint browser:true */
var cronshot = require('../src/index'),
    middleware = {
        'local': require('cronshot-local'),
        'imagemagick': require('cronshot-imagemagick'),
        'mobstor': require('cronshot-mobstor')
    };

// // Local and Mobstor example
// cronshot.startCapturing({
//     // The URL of the website to take a screenshot of
//     'url': 'http://sizeddevised.corp.ne1.yahoo.com:3000/console?m_id=td-applet-myteams',
//     // Where to save the screen shot locally
//     'path': __dirname,
//     'cronPattern': false,
//     // 'takeShotOnCallback': true,
//     // 'script': function() {
//     //     setTimeout(function() {
//     //         if (document.readyState === 'complete') {
//     //             window.callPhantom('takeShot');
//     //         }
//     //     }, 50);
//     // },
//     'renderDelay': 5000,
//     //'customCSS' : '.js-applet { background: #ABC; transition: none; -webkit-transition: none; }',
//     // Our middleware modules
//     'saveMiddleware': [{
//         'middleware': middleware.local
//     }, {
//         'middleware': middleware.mobstor,
//         'options': {
//             'host': 'playground.yahoofs.com',
//             'hostPath': '/test'
//         }
//     }]
// });

// Image Magick example
// cronshot.startCapturing({
//     // The URL of the website to take a screenshot of
//     'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
//     // Where to save the screen shot locally
//     'path': __dirname,
//     //'customCSS' : '.js-applet { background: #ABC; transition: none; -webkit-transition: none; }',
//     // Our middleware modules
//     'saveMiddleware': [{
//         // Function that does all the Image Magick stuff
//         'middleware': middleware.imagemagick,
//         'options': {
//             'gmCommands': [{
//                 'method': 'trim',
//                 'args': []
//             }, {
//                 'method': 'channel',
//                 'args': ["Opacity"]
//             }, {
//                 'method': 'fill',
//                 'args': ["rgba(255, 255, 255, 0.2)"]
//             }, {
//                 'method': 'opaque',
//                 'args': ["#FFF"]
//             }, {
//                 'method': 'quality',
//                 'args': [100]
//             }]
//         }
//     }]
// });

// Image Magick and Mobstor example
// cronshot.startCapturing({
//     // The URL of the website to take a screenshot of
//     'url': 'http://touchdown.media.yahoo.com:4080/console/?m_id=td-applet-scores',
//     // Where to save the screen shot locally
//     'path': __dirname,
//     //'customCSS' : '.js-applet { background: #ABC; transition: none; -webkit-transition: none; }',
//     // Our middleware modules
//     'saveMiddleware': [{
//         // Function that does all the Image Magick stuff
//         'middleware': middleware.imagemagick,
//         'options': {
//             'gmCommands': [{
//                 'method': 'trim',
//                 'args': []
//             }, {
//                 'method': 'channel',
//                 'args': ["Opacity"]
//             }, {
//                 'method': 'fill',
//                 'args': ["rgba(255, 255, 255, 0.2)"]
//             }, {
//                 'method': 'opaque',
//                 'args': ["#FFF"]
//             }, {
//                 'method': 'quality',
//                 'args': [100]
//             }]
//         }
//     }, {
//         'middleware': middleware.mobstor,
//         'options': {
//             'host': 'playground.yahoofs.com',
//             'hostPath': '/test'
//         }
//     }]
// });

// Save Local File Example
// cronshot.startCapturing({
//     'url': 'http://yahoo.com',
//     'path': __dirname,
//     'cronPattern': '',
//     'saveMiddleware': middleware.local,
//     'customCSS': '* { whitespace: nowrap !important; }'
// }, function(err) {
//     if (err) {
//         console.error(err);
//     }
// });
cronshot.startCapturing([{
    url: 'http://overthrownalone.corp.ne1.yahoo.com:3000/console/?m_id=td-applet-currentplay&gameState=2',
    imageName: 'lA00.png',
    hostPath: '/49ers/l',
    path: process.cwd(),
    saveMiddleware: [middleware.local, middleware.mobstor],
    timeout: 20000,
    streamType: 'png',
    cronPattern: false,
    windowSize: {
        width: 1920,
        height: 1080
    },
    shotSize: {
        width: 'all',
        height: 'all'
    },
    takeShotOnCallback: true,
    'script': function() {
        var images = document.querySelectorAll('img'),
            loadedAllImages = true,
            currentImage;

        for (var x = 0; x < images.length; x++) {
            currentImage = images[x];
            if (!currentImage.complete) {
                loadedAllImages = false;
            }
        }

        if (loadedAllImages) {
            window.callPhantom('takeShot');
        }
    },
    defaultWhiteBackground: false,
    zoomFactor: 1,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
    errorIfStatusIsNot200: true,
    silent: false,
    host: 'playground.yahoofs.com',
    headers: {
        'Cache-Control': 'no-store'
    }
}, {
    url: 'http://overthrownalone.corp.ne1.yahoo.com:3000/console/?m_id=td-applet-currentplay&gameState=2',
    imageName: 'lA01.png',
    hostPath: '/49ers/l',
    path: process.cwd(),
    saveMiddleware: [middleware.local, middleware.mobstor],
    streamType: 'png',
    cronPattern: false,
    windowSize: {
        width: 1920,
        height: 1080
    },
    shotSize: {
        width: 'all',
        height: 'all'
    },
    takeShotOnCallback: true,
    'script': function() {
        var images = document.querySelectorAll('img'),
            loadedAllImages = true,
            currentImage;

        for (var x = 0; x < images.length; x++) {
            currentImage = images[x];
            if (!currentImage.complete) {
                loadedAllImages = false;
            }
        }

        if (loadedAllImages) {
            window.callPhantom('takeShot');
        }
    },
    defaultWhiteBackground: false,
    zoomFactor: 1,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
    errorIfStatusIsNot200: true,
    silent: false,
    host: 'playground.yahoofs.com',
    headers: {
        'Cache-Control': 'no-store'
    }
}]);