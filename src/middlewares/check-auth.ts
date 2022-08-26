import { NextFunction } from "grammy";
import { Chat } from "grammy/out/platform.node";
import { MyContext } from "../types";
import {Moderators} from "../database/models/moderators";

export const checkAuthorization = async (
  ctx: MyContext & { chat: Chat.PrivateChat },
  next: NextFunction
) => {
  const moderator = await Moderators.findOne({telegramID: ctx.from.id});

  if (moderator) {
    return next();
  } else {
    await ctx.reply(ctx.t("auth-failure"));
    return false;
  }
};
