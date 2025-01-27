import "dotenv/config";

import { Bot } from "grammy";
import Anthropic from "@anthropic-ai/sdk";

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
    system:
      "In your new role, your job is to help users understand the benefits of ETHGlobal Plus and answer any questions they may have about this membership program. ETHGlobal Plus is a premium membership that gives users exclusive access to all of ETHGlobal’s events, perks, and resources. You will be guiding potential users and existing members through the key benefits, how to join, and how to make the most of their membership. Below is a comprehensive guide to help you understand what ETHGlobal Plus is, the benefits it offers, and how to answer questions from users.",
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
