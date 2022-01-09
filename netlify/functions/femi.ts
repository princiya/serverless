import { App, ExpressReceiver, ReceiverEvent } from "@slack/bolt";
import * as dotenv from "dotenv";

dotenv.config();

function parseRequestBody(stringBody: string | null, contentType: string | undefined): any | undefined {
    try {
        if (!stringBody) {
            return "";
        }

        let result: any = {};

        if (contentType && contentType === "application/json") {
            return JSON.parse(stringBody);
        }

        let keyValuePairs: string[] = stringBody.split("&");
        keyValuePairs.forEach(function (pair: string): void {
            let individualKeyValuePair: string[] = pair.split("=");
            result[individualKeyValuePair[0]] = decodeURIComponent(individualKeyValuePair[1] || "");
        });
        return JSON.parse(JSON.stringify(result));

    } catch {
        return "";
    }
}

const expressReceiver: ExpressReceiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  processBeforeResponse: true
});

const app: App = new App({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  token: `${process.env.SLACK_BOT_TOKEN}`,
  receiver: expressReceiver
});

const {
    DATABASE_URL,
    SUPABASE_SERVICE_API_KEY
} = process.env;
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

// app.message(async ({ message }) => {
//   const reactionPacket: ISlackReactionReply = {
//     app: app,
//     botToken: process.env.SLACK_BOT_TOKEN,
//     channelId: message.channel,
//     threadTimestamp: message.ts,
//     reaction: "robot_face"
//   };
//   await replyReaction(reactionPacket);

//   const messagePacket: ISlackReply = {
//     app: app,
//     botToken: process.env.SLACK_BOT_TOKEN,
//     channelId: message.channel,
//     threadTimestamp: message.ts,
//     message: "Hello :wave:"
//   };
//   await replyMessage(messagePacket);
// });

// app.command(SlashCommands.GREET, async({body, ack}) => {
//   ack();

//   const messagePacket: ISlackPrivateReply = {
//     app: app,
//     botToken: process.env.SLACK_BOT_TOKEN,
//     channelId: body.channel_id,
//     userId: body.user_id,
//     message: "Greetings, user!"
//   };
//   await replyPrivateMessage(messagePacket);
// });

export async function handler(event) {
  const payload: any = parseRequestBody(event.body, event.headers["content-type"]);
  const slackEvent: ReceiverEvent = {
    body: payload,
    ack: async (response): Promise<any> => {
        return {
          statusCode: 200,
          body: response ?? ""
        };
    }
  };
  const { message: { text = '' }, user: { name = '' } } = JSON.parse(payload.payload);

  console.log('payload', JSON.parse(payload.payload));

  await supabase
        .from('Article')
        .insert([
            { title: 'from slack', description: text, author: name },
        ]);
  
  await app.processEvent(slackEvent);

  return {
    statusCode: 200,
    body: ""
  };
}

