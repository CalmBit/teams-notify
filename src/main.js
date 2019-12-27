import core from '@actions/core';
import github from '@actions/github';
import request from 'request';

const status = {
  "success": "succeeded",
  "failure": "failed",
  "canceled": "been canceled"
}

async function run() {
  try {
    console.log(core)
    console.log(core.getInput("status"))
    let s = core.getInput("status")
    if (status[s] === undefined) {
      core.setFailed("Bad `status` type '" + s + "'.")
      return
    }
    let url = process.env.MSTEAMS_WEBHOOK_URL || core.getInput("webhook_url")
    request.post(url, { json: true, body: generateCard(), }, function (err, resp, body) {
      if(err) {
        core.setFailed(err)
        return
      }
    })
  } catch (error) {
    core.setFailed(error.message);
  }
}

function generateCard() {
  return {
    "contentType": "application/vnd.microsoft.teams.card.o365connector",
    "content": {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "summary": "Build has " + status[core.getInput("status")],
      "title": core.getInput("card_name")
    }
  }
}

run();