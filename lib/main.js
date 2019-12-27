"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const request_1 = __importDefault(require("request"));
const status = {
    "success": "succeeded",
    "failure": "failed",
    "canceled": "been canceled"
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let s = core_1.default.getInput("status");
            if (status[s] === undefined) {
                core_1.default.setFailed("Bad `status` type '" + s + "'.");
                return;
            }
            let url = process.env.MSTEAMS_WEBHOOK_URL || core_1.default.getInput("webhook_url");
            request_1.default.post(url, { json: true, body: generateCard(), }, function (err, resp, body) {
                if (err) {
                    core_1.default.setFailed(err);
                    return;
                }
            });
        }
        catch (error) {
            core_1.default.setFailed(error.message);
        }
    });
}
function generateCard() {
    return {
        "contentType": "application/vnd.microsoft.teams.card.o365connector",
        "content": {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "summary": "Build has " + status[core_1.default.getInput("status")],
            "title": core_1.default.getInput("card_name")
        }
    };
}
run();
