const core = require('@actions/core');
const request = require('request');

const status = {
  "success": "succeeded",
  "failure": "failed",
  "canceled": "been canceled"
}

async function run() {
  try {
    let s = core.getInput("status").toLowerCase()
    if (status[s] === undefined) {
      core.setFailed("Bad `status` type '" + s + "'.")
      return
    }
    let url = process.env.MSTEAMS_WEBHOOK_URL
    console.log(url)
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
      "title": core.getInput("card_name")
    }
}

run();
