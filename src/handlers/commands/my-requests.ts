import { Bot, InlineKeyboard, Keyboard, NextFunction } from "grammy";
import { Chat } from "@grammyjs/types";
import { MyContext } from "../../types";
import { isPrivate } from "../../filters/";
import moment from "moment";

async function myRequests(ctx: MyContext & { chat: Chat.PrivateChat }) {
  ctx.session.state = {
    main: "my_requests",
  };

  const findMyRequests = await ctx.database.Requests.find({
    $and: [{ fakeStatus: 0 }, { takenModerator: ctx.from.id }],
  });

  const messageText = ctx.t("my_requests");

  const inlineKeyboard = new InlineKeyboard();

  findMyRequests.forEach((request) => {
    let name = "";

    if (request.text && request.text.length > 50) {
      name = request.text.substring(0, 50) + "...";
    } else {
      name = request.text;
    }

    const date = moment(request.createdAt).format("DD.MM HH:mm");

    inlineKeyboard
      .text(`${date} : ${name}`, `moderation:view:${request._id}:id`)
      .row();
  });

  inlineKeyboard.text(ctx.t("back-button"), "cabinet");

  await ctx.reply(messageText, {
    reply_markup: inlineKeyboard,
    disable_web_page_preview: true,
  });
}

async function setup(bot: Bot<MyContext>) {
  const privateMessage = bot.filter(isPrivate);

  privateMessage.callbackQuery("my_requests", myRequests);
}

export default { setup };
