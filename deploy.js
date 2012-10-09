#! /usr/bin/env node
var CloudfilesMirror = require("cloudfiles-mirror");
var exec = require('child_process').exec;
var async = require("async");
var colors = require('colors');
var apiKey, env;

function parseArgs(){
  if (process.argv.length !== 4){
    console.error('Usage: ./deploy.js staging RACKSPACE_API_KEY');
    process.exit(1);
  }
  env = process.argv[2];
  apiKey = process.argv[3];
}

function getContainer(){
  if (env === 'staging'){
    return 'budget2012-staging';
  }else if (env === 'production'){
    return 'budget2012';
  }else{
    console.error('unknown environment: ' + env + '. Should be staging or production');
    process.exit(1);
  }
}

function checkout(cb){
  exec('git checkout ' + env, cb);
}

function build(cb){
  exec('./build.php', cb);
}

function cdnSync(cb){
  var container = getContainer();
  async.forEach(['build', 'img'], function(dir, next){
    console.error('syncing ' + dir + ' to ' + container + '...');
    mirror = CloudfilesMirror({
      localPath: './web/' + dir,
      remoteBase: dir,
      container: container,
      auth : { username: 'theglobalmail', apiKey: apiKey},
      cdnEnabled: true,
      pushOnBoot: true
    });
    mirror.on('error', next);
    mirror.on('end', function(err){
      next();
    });
  }, cb);
}

function push(cb){
  exec('git push origin HEAD', cb);
}

parseArgs();
async.series([checkout, build, cdnSync, push], function(err){
  if (err){
    console.error(err.red);
    process.exit(1);
  }
  console.error('ok'.green);
});
