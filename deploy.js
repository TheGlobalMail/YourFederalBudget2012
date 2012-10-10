#! /usr/bin/env node
var CloudfilesMirror = require("cloudfiles-mirror");
var exec = require('child_process').exec;
var async = require("async");
var colors = require('colors');
var request = require('request');

var auth = 'ac2aa55ec8adecc56501fc32cc22ec38';
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

function getServers(){
  if (env === 'staging'){
    return ['50.56.185.86'];
  }else if (env === 'production'){
    return ['50.56.172.114', '198.101.231.69'];
  }else{
    console.error('unknown environment: ' + env + '. Should be staging or production');
    process.exit(1);
  }
}

function build(cb){
  run('./build.php', cb);
}

function cdnSync(cb){
  var container = getContainer();
  async.forEach(['build', 'img', 'vendor'], function(dir, next){
    console.error('Syncing ' + dir + ' to ' + container + '...');
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
      console.error(('Syncing ' + dir + ' to ' + container + ' OK').green)
      next();
    });
  }, cb);
}

function run(cmd, cb){
  console.error('Running command: ' + cmd);
  exec(cmd, function(err, stdout, stderr){
    if (err){
      console.error(stdout.blue);
      console.error(stderr.pink);
      console.error(('Running command: ' + cmd + ' ERROR').red);
    }else{
      console.error(('Running command: ' + cmd + ' OK').green);
    }
    cb(err);
  });
}

function deploy(cb){
  var servers = getServers();
  async.forEach(servers, function(server, done){ 
    console.error('Triggering deploy on ' + server);
    request({method: 'POST', url: 'http://' + server + '/deploy', form: {auth: auth}}, function(err, res, body){
      if (err){
        console.error(('ERROR: ' + err).red);
        return cb('Triggering deploy on ' + server + ' ERROR');
      }
      if (res.statusCode != 200){
        console.error(('ERROR: status code was ' + res.statusCode).red);
        console.error(('ERROR: ' + body).red);
        return cb('Triggering deploy on ' + server + ' ERROR');
      }
      console.error(body);
      console.error(('Triggering deploy on ' + server + ' OK').green);
      cb();
    });
  });
}

parseArgs();
async.series([build, cdnSync, deploy], function(err){
  if (err){
    console.error(('ERROR: ' + err).red);
    process.exit(1);
  }
  console.error('ok'.green);
});
