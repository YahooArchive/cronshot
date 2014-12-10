/*jslint indent: 4, nomen:true, white:true */
/*global require, describe:true,it:true */

var expect = require('chai').expect,
    cronshot = require('../../src/index'),
    localMiddleware = require('cronshot-local');

describe('cronshot', function() {
    it('should error if a saveMiddleware option is not passed', function() {
        cronshot.startCapturing({
            silent: true
        }, function(err) {
            expect(err).not.to.equal(null);
        });
    });

    it("should error if an url option is not passed", function() {
        cronshot.startCapturing({
            silent: true,
            saveMiddleware: []
        }, function(err) {
            expect(err).not.to.equal(null);
        });
    });

    it("should error if a path option is not passed", function() {
        cronshot.startCapturing({
            silent: true,
            saveMiddleware: [localMiddleware]
        }, function(err) {
            expect(err).not.to.equal(null);
        });
    });

    it("should error if webshot throws an error", function() {
        cronshot.startCapturing({
            silent: true,
            saveMiddleware: [localMiddleware],
            url: 'http://yahoo.com',
            path: __dirname + '/../images/',
            cronPattern: false,
            error: true
        }, function(err) {
            expect(err).not.to.equal(null);
        });
    });

    it('should succeed if one middleware functions is used', function(done) {
        var saveMiddlewareExample = function(obj, callback) {
            callback(null, {
                name: 'test'
            });
        };

        cronshot.startCapturing({
            silent: true,
            saveMiddleware: [saveMiddlewareExample],
            url: 'http://yahoo.com',
            path: __dirname + '/../images/',
            cronPattern: false
        }, function(err) {
            expect(err).to.equal(undefined);
            done();
        });
    });

    it('should fail if one middleware functions fails', function(done) {
        var saveMiddlewareExample1 = function(obj, callback) {
                callback(null, {
                    name: 'test1'
                });
            },
            saveMiddlewareExample2 = function(obj, callback) {
                callback(new Error('saveMiddlewareExample2 Error'), {
                    name: 'test2'
                });
            };

        cronshot.startCapturing({
            silent: true,
            saveMiddleware: [saveMiddlewareExample1, saveMiddlewareExample2],
            url: 'http://yahoo.com',
            path: __dirname + '/../images/',
            cronPattern: false
        }, function(err) {
            expect(err).not.to.equal(null);
            done();
        });
    });

    it("should succeed if more than one middleware functions are used", function(done) {
        var saveMiddlewareExample1 = function(obj, callback) {
                callback(null, {
                    name: 'test1'
                });
            },
            saveMiddlewareExample2 = function(obj, callback) {
                callback(null, {
                    name: 'test2'
                });
            };

        cronshot.startCapturing({
            silent: true,
            saveMiddleware: [saveMiddlewareExample1, saveMiddlewareExample2],
            url: 'http://yahoo.com',
            path: __dirname + '/../images/',
            cronPattern: false
        }, function(err) {
            expect(err).to.equal(undefined);
            done();
        });
    });

    it('should succeed if the saveMiddleware is set to a function', function(done) {
        var saveMiddlewareExample = function(obj, callback) {
            callback(null, {
                name: 'test1'
            });
        };

        cronshot.startCapturing({
            silent: true,
            saveMiddleware: saveMiddlewareExample,
            url: 'http://yahoo.com',
            path: __dirname + '/../images/',
            cronPattern: false
        }, function(err) {
            expect(err).to.equal(null);
            done();
        });
    });

    it('should succeed if the saveMiddleware is set to an array of objects', function(done) {
        this.timeout(5000);
        var saveMiddlewareExample1 = function(obj, callback) {
                callback(null, {
                    name: 'test1'
                });
            },
            saveMiddlewareExample2 = function(obj, callback) {
                callback(null, {
                    name: 'test2'
                });
            };

        cronshot.startCapturing({
            silent: true,
            saveMiddleware: [{
                'middleware': saveMiddlewareExample1
            }, {
                'middleware': saveMiddlewareExample2
            }],
            url: 'http://yahoo.com',
            path: __dirname + '/../images/',
            cronPattern: false
        }, function(err) {
            expect(err).to.equal(undefined);
            done();
        });
    });

    it('should succeed if a 1 second cronPattern is used', function(done) {
        this.timeout(5000);

        var saveMiddlewareExample1 = function(obj, callback) {
                callback(null, {
                    name: 'test1'
                });
            },
            saveMiddlewareExample2 = function(obj, callback) {
                callback(null, {
                    name: 'test2'
                });
            };

        cronshot.startCapturing({
            silent: true,
            saveMiddleware: [saveMiddlewareExample1, saveMiddlewareExample2],
            url: 'http://yahoo.com',
            path: __dirname + '/../images/',
            cronPattern: '*/1 * * * * *',
            max: 2
        }, function(err) {
            expect(err).to.equal(null);
            done();
        });
    });

    it('should succeed if multiple screenshot jobs are run in parallel', function(done) {
        var saveMiddlewareExample = function(obj, callback) {
            callback(null, {
                name: 'test'
            });
        };

        cronshot.startCapturing({
            'screenshots': [{
                silent: true,
                saveMiddleware: [saveMiddlewareExample],
                url: 'http://yahoo.com',
                path: __dirname + '/../images/',
                cronPattern: false
            }, {
                silent: true,
                saveMiddleware: [saveMiddlewareExample],
                url: 'http://yahoo.com',
                path: __dirname + '/../images/',
                cronPattern: ''
            }]
        }, function(err) {
            expect(err).to.equal(null);
            done();
        });
    });

});