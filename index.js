var GitHubApi = require('github');
var github = new GitHubApi({
    version: '3.0.0'
});
var secrets = require('./secrets.js');

exports.handler = function(event, context) {
    var githubEvent = event.Records[0].Sns.Message;
    console.log('Received GitHub event:', githubEvent);

    if (!githubEvent.hasOwnProperty('issue') || githubEvent.action !== 'opened') {
        // Not an event for opening an issue
        context.succeed();
    }

    // Authenticate to comment on the issue
    github.authenticate({
        type: 'oauth',
        token: secrets.token
    });

    var poster = githubEvent.issue.user.login;

    github.issues.createComment({
        user: githubEvent.repository.owner.login,
        repo: githubEvent.repository.name,
        number: githubEvent.issue.number,
        body: "Hi @" + poster + "!\n" +
              "\n" +
              "Thank you for your interest in this project! Unfortunately, we're " +
              "really busy at the moment, but we'll get to your issue as soon as " +
              "possible. Have a great day!"
    }, context.done);
};