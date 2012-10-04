#!/usr/bin/env node
var sys = require('sys');
var nl = require('nodeload');
var request = require('request');
//var server = 'localhost:5000';
//var server = 'budget2012.theglobalmail.org';
var server = '174.143.186.92';
var writes;

console.log("Running test on " + server);

var payload = {"name":"B.J. Rossiter","state":"ACT","createdAt":0,"defence":0,"publicEducation":13.4,"privateEducation":0,"immigration":12.4,"foreignAid":10.5,"industryAssistance":12.2,"email":"bj.rossiter@theglobalmail.org","description":"test"};

function createBudget(cb, client){
  req = request({method: 'POST', url: 'http://' + server + '/api/budget/', json: payload}, function(err, res, body){
    cb({req: req, res: res});
  });
};

writes = {
  name: "Create budgets",
  host: server,
  port: 5000,
  numUsers: 50,
  timeLimit: (60 * 20), // 20mins
  targetRps: 2,
  reportInterval: 2,
  stats: ['result-codes', 'latency', 'concurrency', 'uniques', { name: 'http-errors', successCodes: [204], log: 'http-errors.log' }],
  requestLoop: createBudget 
};

nl.run(writes);
