/*
#Description

 - It skips the protocol and user/password if provided part from the URL (http:// or https:// or <protocol>://<user>:<password>@ )
 - It maps slashes to !
 - It truncates the URL to 100 chars
 - It includes an optional options argument that allows the user to override the behavior
	+ slashchar char used to replace slashes - default !
	+ maxlength default 100
	+ skipprotocol default true
	+ skipuserpass default true

For example 
 - https://www.odesk.com/mc/ => www.odesk.com!mc
 - http://www.genecards.org/cgi-bin/carddisp.pl?gene=STH => www.genecards.org!cgi-bin!carddisp.pl?gene=STH
 - http://odysseas:secret@www.mysite.com/test.html => www.mysite.com/test.html
*/
"use strict";
var test = require("tap").test;
var slugify_url = require("../index.js");

test("test if slugify-url skips protocol and username/password", function (t) {
	t.equal(slugify_url("https://www.odesk.com/mc/"), "www.odesk.com!mc!");
	t.equal(slugify_url("https://www.odesk.com/mc/", {skipProtocol: false}), "https:!!www.odesk.com!mc!");
	t.equal(slugify_url("https://admin:test@www.odesk.com"), "www.odesk.com");
	t.end();
});

test("test if slugify-url truncates to maximun length", function (t) {
	t.equal(slugify_url("https://www.odesk.com/mc/very_long_url_indeed/very_long_url_indeed/very_long_url_indeed/very_long_url_indeed/very_long_url_indeed/very_long_url_indeed/very_long_url_indeed/very_long_url_indeed/very_long_url_indeed/very_long_url_indeed"), "www.odesk.com!mc!very_long_url_indeed!very_long_url_indeed!very_long_url_indeed!very_long_url_indeed");
	t.equal(slugify_url("https://www.odesk.com/mc/", {maxLength: 13}), "www.odesk.com");
	t.end();
});
