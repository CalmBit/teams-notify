const core = require('@actions/core');
const github = require('@actions/github')
const request = require('request');

const status = {
  "success": "succeeded",
  "failure": "failed",
  "canceled": "been canceled"
}

const desc = {
  "success": "Hooray!",
  "failure": "Uh-oh..",
  "canceled": "Hmm..."
}

async function run() {
  try {
    let s = core.getInput("status").toLowerCase()
    if (status[s] === undefined) {
      core.setFailed("Bad `status` type '" + s + "'.")
      return
    }
    let url = process.env.MSTEAMS_WEBHOOK_URL
    request.post({uri: url, json: true, body: generateCard(s), }, function (err, resp, body) {
      if(err) {
        core.setFailed(err)
        return
      }
    })
  } catch (error) {
    core.setFailed(error.message);
  }
}

function generateCard(s) {
  return {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "summary": "Build has " + status[s],
      "sections": [{
        "activityTitle": "The most recent CI build for '" + github.context.repo.repo + +"' has " + status[s],
        "activitySubtitle": desc[s] 
      }]
    }
}

run();
