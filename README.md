## Your Federal Budget (Australia 2012)

### Requirements ###

You need PHP 5.4, MongoDB and Composer!

### Deployment ###

The app uses github's post commit web hooks to trigger updates and rebuilding
of the deployment. This post commit php handler is designed to only update the
current deployment if the commit is on the current branch that the deployment
is checked out on.

When creating a new deployment:
1. Check the deployment out the correct branch e.g. `git checkout -t origin/staging`.
2. Create a new web hook for the url

### CI ###

http://198.61.194.153:8080/job/budget2012/
