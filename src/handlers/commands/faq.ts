import { Bot, InlineKeyboard, Keyboard, NextFunction } from "grammy";
import { Chat } from "@grammyjs/types";
import { MyContext } from "../../types";
import { isPrivate } from "../../filters/";

async function faqMessage(ctx: MyContext & { chat: Chat.PrivateChat }) {
  const keyboard = new InlineKeyboard().text(ctx.t("back-button"), "cabinet");

  const messageText = ctx.t("faq-message");

  await ctx.editMessageText(messageText, {
    reply_markup: keyboard,
    disable_web_page_preview: true,
  });
}

async function setup(bot: Bot<MyContext>) {
  const privateMessage = bot.filter(isPrivate);

  privateMessage.callbackQuery(/faq/, faqMessage);
}

export default { setup };
