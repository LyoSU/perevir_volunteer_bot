import fs from "fs";
import { Bot, Keyboard, NextFunction } from "grammy";
import { Chat } from "@grammyjs/types";
import { MyContext } from "../../types";
import { isPrivate } from "../../filters/";

// check contact in white list
async function handleContact(ctx: MyContext & { chat: Chat.PrivateChat }) {
  const numbersWhiteList = JSON.parse(
    fs.readFileSync("./whitelist.json", "utf8")
  );

  const contact = ctx.message.contact;

  if (numbersWhiteList.includes(parseInt(contact.phone_number).toString())) {
    ctx.session.phoneNumber = contact.phone_number;

    const keyboard = new Keyboard().add(ctx.t("cabinet_button"));

    await ctx.reply(ctx.t("auth_success"), {
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    });
  }
}

async function checkAuthorization(
  ctx: MyContext & { chat: Chat.PrivateChat },
  next: NextFunction
) {
  if (ctx.session.phoneNumber === null) {
    const keyboard = new Keyboard().requestContact(ctx.t("request_contact"));

    await ctx.reply(ctx.t("need_auth"), {
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    });
    return false;
  }

  return next();
}

async function anyMessage(ctx: MyContext & { chat: Chat.PrivateChat }) {
  await ctx.reply(
    ctx.t("main", {
      botUsername: ctx.me.username,
    }),
    {
      disable_web_page_preview: true,
    }
  );
}

async function setup(bot: Bot<MyContext>) {
  const privateMessage = bot.filter(isPrivate);

  privateMessage.on(":contact", handleContact);
  privateMessage.on("message", checkAuthorization);
  privateMessage.on(":text", anyMessage);
}

export default { setup };
