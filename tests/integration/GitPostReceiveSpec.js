#! /usr/bin/env node
var request = require('request');

var commitOnMaster = {payload: '{ "after": "b890f59b9d44d6c5241a2b62194f10feb71fa5b1", "base_ref": "refs/heads/master", "before": "c1bc847eac48ee7adfac5ebe26030b79a137be0e", "commits": [ { "added": [], "author": { "email": "b.j.rossiter@gmail.com", "name": "B.J. Rossiter", "username": "bxjx" }, "committer": { "email": "b.j.rossiter@gmail.com", "name": "B.J. Rossiter", "username": "bxjx" }, "distinct": false, "id": "b890f59b9d44d6c5241a2b62194f10feb71fa5b1", "message": "Minor update to deployment test", "modified": [ "tests/integration/GitPostReceiveSpec.js" ], "removed": [], "timestamp": "2012-09-17T18:08:26-07:00", "url": "https://github.com/TheGlobalMail/YourFederalBudget2012/commit/b890f59b9d44d6c5241a2b62194f10feb71fa5b1" } ], "compare": "https://github.com/TheGlobalMail/YourFederalBudget2012/compare/c1bc847eac48...b890f59b9d44", "created": false, "deleted": false, "forced": false, "head_commit": { "added": [], "author": { "email": "b.j.rossiter@gmail.com", "name": "B.J. Rossiter", "username": "bxjx" }, "committer": { "email": "b.j.rossiter@gmail.com", "name": "B.J. Rossiter", "username": "bxjx" }, "distinct": false, "id": "b890f59b9d44d6c5241a2b62194f10feb71fa5b1", "message": "Minor update to deployment test", "modified": [ "tests/integration/GitPostReceiveSpec.js" ], "removed": [], "timestamp": "2012-09-17T18:08:26-07:00", "url": "https://github.com/TheGlobalMail/YourFederalBudget2012/commit/b890f59b9d44d6c5241a2b62194f10feb71fa5b1" }, "pusher": { "email": "b.j.rossiter@gmail.com", "name": "bxjx" }, ' + 
  '"ref": "refs/heads/staging", "repository": { "created_at": "2012-08-05T20:33:12-07:00", "description": "Your Federal Budget App", "fork": false, "forks": 0, "has_downloads": true, "has_issues": false, "has_wiki": true, "language": "JavaScript", "name": "YourFederalBudget2012", "open_issues": 0, "organization": "TheGlobalMail", "owner": { "email": null, "name": "TheGlobalMail" }, "private": true, "pushed_at": "2012-09-17T18:12:26-07:00", "size": 2616, "stargazers": 1, "url": "https://github.com/TheGlobalMail/YourFederalBudget2012", "watchers": 1 } }' };

var post = {
  //url: 'http://tgm:passworkd@50.56.179.201:8080/git-post-receive',
  //url: 'http://tgm:password@50.56.185.86:8080/git-post-receive',
  url: 'http://localhost:5000/git-post-receive', 
  json: commitOnMaster
};

request.post(post, function (err, response, body) {
  if (err){
    console.log('error: ' + err);
    return;
  }
  console.log('response: ' + response.statusCode);
  console.log('body: ' + body);
});
