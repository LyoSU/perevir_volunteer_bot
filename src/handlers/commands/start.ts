import { Bot, Keyboard } from "grammy";
import { Chat } from "@grammyjs/types";
import { MyContext } from "../../types";
import { isGroup, isPrivate } from "../../filters/";

async function startPrivate(ctx: MyContext & { chat: Chat.PrivateChat }, next) {
  if (ctx.match === "" || ctx.match === undefined) {
    return next();
  }

  const formId = ctx?.match?.toString()?.match(/form-(\d+)_(.+)/);

  if (formId === undefined) {
    return next(ctx);
  }

  const keyboard = new Keyboard().webApp(
    ctx.t("button_to_form"),
    `https://forms-bot.vercel.app/form/${formId[2]}?chat_id=${formId[1]}&form_id=${formId[2]}`
  );

  await ctx.reply(ctx.t("open_form"), {
    reply_markup: keyboard,
    disable_web_page_preview: true,
  });
}

async function setup(bot: Bot<MyContext>) {
  bot.filter(isPrivate).command("start", startPrivate);
}

export default { setup };
