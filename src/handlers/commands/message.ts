import { Bot, InlineKeyboard, Keyboard, NextFunction } from "grammy";
import { Chat } from "@grammyjs/types";
import { MyContext } from "../../types";
import { isPrivate } from "../../filters/";

async function anyMessage(ctx: MyContext & { chat: Chat.PrivateChat }) {
  await ctx.reply(ctx.t("empty-message"));
}

async function setup(bot: Bot<MyContext>) {
  const privateMessage = bot.filter(isPrivate);

  privateMessage.on(":text", anyMessage);
  privateMessage.callbackQuery("stop_work", anyMessage);
}

export default { setup };
