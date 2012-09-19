var nopt = require('nopt');
var webdriver = require('wd');
var args = nopt(null, null, process.argv, 2);

var configs = {
  'local': {
    desired: [
      {browserName: "firefox"}
    ],
    url: 'http://localhost:5000'
  },
  'sauce': {
    host: "ondemand.saucelabs.com",
    port: 80,
    username: "bxjx",
    accessKey: "a8dc8f4a-fdf7-4ccf-a49c-a914541e6b2f",
    processes: 23,
    maxTests: false,
    serviceName: 'sauce',
    desired: [
      {browserName: "internet explorer", version: '8', platform: "XP", proxy: {proxyType: 'direct'}, 'selenium-version': '2.21.0'},
      {browserName: "firefox", version: '10', platform: "Windows 2003", proxy: {proxyType: 'direct'}},
      {browserName: "chrome", version: '', platform: "VISTA", proxy: {proxyType: 'direct'}}
    ],
    url: 'http://tgm:tgm123@budget2012-dev.thegmail.net.au:8080'
  }
};

/*
 * Return a webdriver browser. The browser will either connect to a local
 * selenium server or sauce depending on arguments
 */
exports.startBrowser = function(cb){

  var conf = args['with-sauce'] ? configs.sauce : configs.local;
  var browser = webdriver.remote(conf.host, conf.port, conf.username, conf.accessKey);

  if (args['debug-wd']){
    browser.on('status', function(info){
      console.log('\x1b[36m%s\x1b[0m', info);
    });

    browser.on('command', function(meth, path){
      console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
    });
  }

  browser.init(conf.desired, function(){
    browser.get(conf.url, function(err){
      cb(err, browser);
    });
  });
};

/*
 * Find an input by the name attribute and then send text to it
 */
exports.inputText = function(browser, name, text, cb){
  browser.elementByCssSelector('[name="' + name + '"]', function(err, el){
    if (err) return cb(err);
    browser.type(el, text, cb);
  });
};

/*
 * Find an element by css and click it
 */
exports.click = function(browser, id, cb){
  browser.elementById('submit-save-budget', function(err, el){ 
    browser.clickElement(el, function(err){
      setTimeout(function(){ cb(err); }, 500);
    });
  });
};
