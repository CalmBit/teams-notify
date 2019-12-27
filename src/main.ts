import core from '@actions/core';
import github from '@actions/github';

const status = {
  "success": "succeeded",
  "failure": "failed",
  "canceled": "been canceled"
}

async function run() {
  try {
    let s = core.getInput("status")
    if(status[s] === undefined) {
      core.setFailed("Bad `status` type '" + s + "'.")
    }
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
