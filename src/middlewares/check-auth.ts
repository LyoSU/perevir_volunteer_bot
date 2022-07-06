import fs from "fs";
import { NextFunction, Keyboard } from "grammy";
import { Chat } from "grammy/out/platform.node";
import { MyContext } from "../types";

const handleContact = async (
  ctx: MyContext & { chat: Chat.PrivateChat },
  next: NextFunction
) => {
  const numbersWhiteList = JSON.parse(
    fs.readFileSync("./whitelist.json", "utf8")
  );

  const contact = ctx.message.contact;

  if (
    numbersWhiteList.includes(parseInt(contact.phone_number).toString()) &&
    contact.user_id === ctx.from.id
  ) {
    ctx.user.phoneNumber = parseInt(contact.phone_number);

    const keyboard = new Keyboard().add(ctx.t("cabinet-button"));

    await ctx.reply(ctx.t("auth-success"), {
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    });
  } else {
    const keyboard = new Keyboard().requestContact(ctx.t("request-contact"));

    await ctx.reply(ctx.t("need-auth"), {
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    });
  }
};

export const checkAuthorization = async (
  ctx: MyContext & { chat: Chat.PrivateChat },
  next: NextFunction
) => {
  if (ctx?.message?.contact) {
    return handleContact(ctx, next);
  }

  if (!ctx.user.phoneNumber) {
    const keyboard = new Keyboard().requestContact(ctx.t("request-contact"));

    await ctx.reply(ctx.t("need-auth"), {
      reply_markup: {
        resize_keyboard: true,
        keyboard: keyboard.build(),
      },
    });
    return false;
  } else {
    const numbersWhiteList = JSON.parse(
      fs.readFileSync("./whitelist.json", "utf8")
    );

    if (numbersWhiteList.includes(ctx.user.phoneNumber.toString())) {
      return next();
    } else {
      ctx.user.phoneNumber = undefined;
      await ctx.reply(ctx.t("auth-failure"));
      return false;
    }
  }
};
