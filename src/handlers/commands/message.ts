import { Bot, InlineKeyboard, Keyboard, NextFunction } from "grammy";
import { Chat } from "@grammyjs/types";
import { MyContext } from "../../types";
import { isPrivate } from "../../filters/";

async function anyMessage(ctx: MyContext & { chat: Chat.PrivateChat }) {
  const keyboard = new Keyboard().add(ctx.t("cabinet-button"));

  const messageText = ctx.t("any-message");

  await ctx.reply(messageText, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
}

async function setup(bot: Bot<MyContext>) {
  const privateMessage = bot.filter(isPrivate);

  privateMessage.on(":text", anyMessage);
}

export default { setup };
