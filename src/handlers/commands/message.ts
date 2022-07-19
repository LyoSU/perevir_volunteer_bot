import { Bot, InlineKeyboard, Keyboard, NextFunction } from "grammy";
import { Chat } from "@grammyjs/types";
import { MyContext } from "../../types";
import { isPrivate } from "../../filters/";

async function anyMessage(ctx: MyContext & { chat: Chat.PrivateChat }) {
  const keyboard = new Keyboard()
    .add(ctx.t("cabinet-button"))
    .row()
    .add(ctx.t("faq-button"));

  const messageText = ctx.t("auth-success");

  await ctx.reply(messageText, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
}

async function setup(bot: Bot<MyContext>) {
  const privateMessage = bot.filter(isPrivate);

  privateMessage.command("start", anyMessage);
  privateMessage.on(":text", anyMessage);
}

export default { setup };
