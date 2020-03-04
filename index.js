var GitHubApi = require('@octokit/rest');
var github = new GitHubApi({
    version: '3.0.0'
});
var secrets = require('./secrets.js');

module.exports.handler = function(event, context, callback) {
  var githubEvent = event.Records[0].Sns.Message;
  console.log('Received GitHub event:', githubEvent);

  if (!githubEvent.hasOwnProperty('issue') || githubEvent.action !== 'opened') {
      // Not an event for opening an issue
      return callback(null, 'Not an event for opening issue');
  }

  // Authenticate to comment on the issue
  github.authenticate({ type: 'oauth', token: secrets.token})
    .then(() => {
      return github.issues.createComment({
        owner: 'taraadiseshan',
        repo: 'open-source-roomba',
        number: 5,
        body: "Hi @taraadiseshan!\n" +
              "\n" +
              "Thank you for your interest in this project! Unfortunately, we're " +
              "really busy at the moment, but we'll get to your issue as soon as " +
              "possible. Have a great day!"
      });
    })
    .then(() => callback())
    .catch((err) => {return callback(err);});
};