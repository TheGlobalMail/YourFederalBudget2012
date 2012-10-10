#! /usr/bin/env node
var CloudfilesMirror = require("cloudfiles-mirror");
var exec = require('child_process').exec;
var async = require("async");
var colors = require('colors');
var request = require('request');
var argv = require('optimist')
  .usage('Usage: $0 -e [environment] -p [apikey]')
  .demand(['e','k'])
  .alias('e', 'env')
  .describe('e', 'Environment to deploy to')
  .alias('k', 'key')
  .describe('k', 'Rackspace API key')
  .alias('a', 'all')
  .describe('a', 'Sync all asssets (not just build files)')
  .argv;

var auth = 'ac2aa55ec8adecc56501fc32cc22ec38';

function getContainer(){
  if (argv.env === 'staging'){
    return 'budget2012-staging';
  }else if (argv.env === 'production'){
    return 'budget2012';
  }else{
    console.error('unknown environment: ' + argv.env + '. Should be staging or production');
    process.exit(1);
  }
}

function getServers(){
  if (argv.env === 'staging'){
    return ['50.56.185.86'];
  }else if (argv.env === 'production'){
    return ['50.56.172.114', '198.101.231.69'];
  }else{
    console.error('unknown environment: ' + argv.env + '. Should be staging or production');
    process.exit(1);
  }
}

function build(cb){
  run('./build.php', cb);
}

function cdnSync(cb){
  var container = getContainer();
  var syncDirs = argv.all ? ['build', 'img', 'vendor'] : ['build'];
  async.forEach(syncDirs, function(dir, next){
    console.error('Syncing ' + dir + ' to ' + container);
    mirror = CloudfilesMirror({
      localPath: './web/' + dir,
      remoteBase: dir,
      container: container,
      auth : { username: 'theglobalmail', apiKey: argv.key},
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
        return done('Triggering deploy on ' + server + ' ERROR');
      }
      if (res.statusCode != 200){
        console.error(('ERROR: status code was ' + res.statusCode).red);
        console.error(('ERROR: ' + body).red);
        return done('Triggering deploy on ' + server + ' ERROR');
      }
      console.error(('Triggering deploy on ' + server + ' OK').green);
      done();
    });
  }, cb);
}

async.series([build, cdnSync, deploy], function(err){
  if (err){
    console.error(('ERROR: ' + err).red);
    process.exit(1);
  }
  console.error('ok'.green);
});
