import "dotenv/config";

import { Bot } from "grammy";
import Anthropic from "@anthropic-ai/sdk";
import SYSTEM_PROMPT from "./prompt";

const { ANTHROPIC_API_KEY, TELEGRAM_BOT_TOKEN } = process.env;

if (!ANTHROPIC_API_KEY || !TELEGRAM_BOT_TOKEN) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const client = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

const bot = new Bot(TELEGRAM_BOT_TOKEN);

// Register listeners to handle messages
bot.on("message:text", async (ctx) => {
  const message = await client.messages.create({
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: ctx.message.text }],
    model: "claude-3-5-sonnet-latest",
  });

  for (const item of message.content) {
    if (item.type === "text") {
      await ctx.reply(item.text);
    }
  }
});

// Start the bot (using long polling)
bot.start();
