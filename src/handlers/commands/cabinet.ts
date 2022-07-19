import { Chat } from "@grammyjs/types";
import { Bot, InlineKeyboard } from "grammy";
import { isPrivate } from "../../filters";
import { MyContext } from "../../types";

async function cabinetMain(ctx: MyContext & { chat: Chat.PrivateChat }) {
  ctx.session.state = {
    main: "cabinet",
  };

  const myRequestsCount = await ctx.database.Requests.countDocuments({
    $and: [{ fakeStatus: 0 }, { takenModerator: ctx.from.id }],
  });

  const inlineKeyboard = new InlineKeyboard()
    .text(ctx.t("start-work-button"), "start_work")
    .row()
    .text(
      ctx.t("my-requests-button", {
        my_requests_count: myRequestsCount,
      }),
      "my_requests"
    );

  const messageText = ctx.t("main", {
    today_requests: 0,
    comments_count: 0,
    requests_count: 0,
  });

  if (ctx.callbackQuery) {
    await ctx.editMessageText(messageText, {
      reply_markup: inlineKeyboard,
      disable_web_page_preview: true,
    });
  } else {
    await ctx.reply(messageText, {
      reply_markup: inlineKeyboard,
      disable_web_page_preview: true,
    });
  }
}

async function setup(bot: Bot<MyContext>) {
  const privateMessage = bot.filter(isPrivate);

  privateMessage
    .filter((ctx) => ctx?.message?.text === ctx.t("cabinet-button"))
    .use(cabinetMain);

  privateMessage.callbackQuery("cabinet", cabinetMain);
  privateMessage.callbackQuery("stop_work", cabinetMain);
}

export default { setup };
