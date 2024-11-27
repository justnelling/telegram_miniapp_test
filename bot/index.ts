import { Telegraf } from "telegraf";
import { BOT_TOKEN, WEBAPP_URL } from "./config";

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM BOT_TOKEN must be provided!");
}

const bot = new Telegraf(BOT_TOKEN);

// basic commands
//! apparently in telegram mini apps, we can only receive parameters through the 'startapp' parameter
bot.command("start", (ctx: any) => {
  ctx.reply(
    "Welcome to TaskBoarderBot! 🚀\nUse /help to see available commands."
  );
});

bot.command("help", (ctx: any) => {
  ctx.reply(
    "Available commands:\n" +
      "/start - Start the bot\n" +
      "/help - Show this help message\n" +
      "/web - Open the Mini App"
  );
});

bot.command("web", (ctx: any) => {
  const chatId = ctx.chat.id;

  // encode the chatId in base64 to make it URL safe
  const encodedGroupId = Buffer.from(chatId.toString()).toString("base64");

  console.log(`Chat ID: ${chatId}`);
  console.log(`Encoded group ID: ${encodedGroupId}`);

  ctx.reply("Open Web App", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Open App", url: `${WEBAPP_URL}?startapp=${encodedGroupId}` }],
      ],
    },
  });
});

bot.launch().then(() => {
  console.log("Bot is running...");
});

// enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
