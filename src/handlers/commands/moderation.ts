import {
  Api,
  Bot,
  Context,
  InlineKeyboard,
  NextFunction,
  InputFile,
} from "grammy";
import { FileFlavor, FileApiFlavor, hydrateFiles } from "@grammyjs/files";
import { Chat } from "@grammyjs/types";
import { MyContext } from "../../types";
import { isPrivate } from "../../filters/";
import * as models from "../../database/models";
import mongoose from "mongoose";
import moment from "moment";

type PerevirContext = FileFlavor<Context>;
type PerevirApi = FileApiFlavor<Api>;

const preverirBot = new Bot<PerevirContext, PerevirApi>(
  process.env.PEREVIR_BOT_TOKEN
);

preverirBot.api.config.use(hydrateFiles(process.env.PEREVIR_BOT_TOKEN));

async function startWork(ctx: MyContext & { chat: Chat.PrivateChat }) {
  ctx.session.state.main = "moderation";

  return moderationView(ctx);
}

async function stopWork(
  ctx: MyContext & { chat: Chat.PrivateChat },
  next: NextFunction
) {
  ctx.session.state = {};

  return next();
}

async function moderationTake(ctx: MyContext & { chat: Chat.PrivateChat }) {
  const requestId = ctx.match[3];

  const request = await ctx.database.Requests.findOne({
    _id: new mongoose.Types.ObjectId(requestId),
  });

  request.takenModerator = ctx.from.id;
  request.takenAt = new Date();

  await request.save();

  await ctx.answerCallbackQuery({
    text: ctx.t("taked", {
      request_id: request.requestId || "-",
    }),
    show_alert: true,
  });

  return moderationView(ctx);
}

async function moderationView(ctx: MyContext & { chat: Chat.PrivateChat }) {
  if (
    ctx.session.state.mediaMessages &&
    ctx.session.state.mediaMessages.length > 0
  ) {
    for (const message of ctx.session.state.mediaMessages) {
      await ctx.api
        .deleteMessage(message.chat.id, message.message_id)
        .catch((() => {}) as any);
    }

    ctx.session.state.mediaMessages = [];
  }

  let moderationType: string;

  if (ctx.callbackQuery) {
    moderationType = ctx.match[2];
  }

  let request: models.Request;

  const maxDate = moment().subtract(1, "day").toDate();

  const onlyUntaken = {
    $or: [{ takenAt: { $lte: maxDate } }, { takenAt: { $exists: false } }],
  };

  if (moderationType === "view") {
    const previousModeration = ctx.match[3];
    const requestType = ctx.match[4];

    if (requestType === "id") {
      request = await ctx.database.Requests.findOne({
        _id: new mongoose.Types.ObjectId(previousModeration),
      });
    } else if (requestType === "next") {
      request = await ctx.database.Requests.findOne({
        $and: [
          { fakeStatus: 0 },
          { _id: { $gt: new mongoose.Types.ObjectId(previousModeration) } },
          onlyUntaken,
        ],
      });
    } else {
      request = await ctx.database.Requests.findOne({
        $and: [
          { fakeStatus: 0 },
          { _id: new mongoose.Types.ObjectId(previousModeration) },
          onlyUntaken,
        ],
      });
    }
  } else {
    request = await ctx.database.Requests.findOne({
      $and: [{ fakeStatus: 0 }, onlyUntaken],
    });
  }

  const mediaCaption = ctx.t("media-caption", {
    request_id: request.requestId || "-",
  });

  const media = [];

  if (request.image.length > 0) {
    for (const image of request.image) {
      const imageObject = await ctx.database.Images.findById(image);

      if (imageObject) {
        const fileInfo = await preverirBot.api.getFile(
          imageObject.telegramFileId
        );

        const filePath = await fileInfo.download();

        media.push({
          type: "photo",
          media: new InputFile(filePath),
          caption: mediaCaption,
        });
      }
    }
  }

  if (request.video.length > 0) {
    for (const video of request.video) {
      const videoObject = await ctx.database.Videos.findById(video);

      if (videoObject) {
        const fileInfo = await preverirBot.api.getFile(
          videoObject.telegramFileId
        );

        const filePath = await fileInfo.download();

        media.push({
          type: "video",
          media: new InputFile(filePath),
          caption: mediaCaption,
        });
      }
    }
  }

  const inlineKeyboard = new InlineKeyboard()
    .text(
      ctx.t("fake-status", {
        status: "true",
      }),
      `moderation:status:${request._id}:true`
    )
    .text(
      ctx.t("fake-status", {
        status: "fake",
      }),
      `moderation:status:${request._id}:fake`
    )
    .text(
      ctx.t("fake-status", {
        status: "other",
      }),
      `moderation:status:${request._id}:other`
    )
    .row();

  inlineKeyboard
    .text(ctx.t("take-button"), `moderation:take:${request._id}`)
    .row();

  if (ctx.session.state.requestId) {
    inlineKeyboard.text(
      ctx.t("previous-button"),
      `moderation:view:${ctx.session.state.requestId}:id`
    );
  }

  inlineKeyboard
    .text(ctx.t("next-button"), `moderation:view:${request._id}:next`)
    .row();

  inlineKeyboard.text(ctx.t("stop-work-button"), "stop_work");

  ctx.session.state.requestId = request._id;

  // const source = ctx.t("sources", {
  //   type: "good",
  //   name: "Zelenskiy",
  //   description:
  //     "офіційний канал президента України Володимира Олександровича Зеленського (джерело)",
  //   true_procent: "100",
  //   fake_procent: "0",
  //   mixed_procent: "0",
  // });

  const messageText = ctx.t("request-view", {
    request_id: request.requestId || "-",
    from_name: request.requesterTG || request.viberRequester || "",
    date: request.createdAt,
    requests_count: request.otherUsetsTG.length,
    source: "",
    text: request.text || "",
  });

  if (media.length > 0) {
    await ctx.deleteMessage();

    const mediaMessages = await ctx.replyWithMediaGroup(media);

    ctx.session.state.mediaMessages = mediaMessages;
  }

  if (ctx.callbackQuery && media.length <= 0) {
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

async function moderationStatusOther(
  ctx: MyContext & { chat: Chat.PrivateChat }
) {
  const requestId = ctx.match[3];

  const request = await ctx.database.Requests.findOne({
    _id: new mongoose.Types.ObjectId(requestId),
  });

  const inlineKeyboard = new InlineKeyboard()
    .text(
      ctx.t("fake-status", {
        status: "reject",
      }),
      `moderation:status:${requestId}:reject`
    )
    .row()
    .text(
      ctx.t("fake-status", {
        status: "noproof",
      }),
      `moderation:status:${requestId}:noproof`
    )
    .row()
    .text(
      ctx.t("fake-status", {
        status: "manipulation",
      }),
      `moderation:status:${requestId}:manipulation`
    );

  await ctx.editMessageText(
    ctx.t("moderation-status", {
      request_id: request.requestId || "-",
      from_name: request.requesterTG || request.viberRequester || "",
    }),
    {
      reply_markup: inlineKeyboard,
      disable_web_page_preview: true,
    }
  );
}

async function moderationStatus(ctx: MyContext & { chat: Chat.PrivateChat }) {
  const requestId = ctx.match[3];
  const status = ctx.match[4];

  const request = await ctx.database.Requests.findOne({
    _id: new mongoose.Types.ObjectId(requestId),
  });

  ctx.session.state.sub = "comment";
  ctx.session.state.requestId = requestId;
  ctx.session.state.fakeStatus = status;

  const inlineKeyboard = new InlineKeyboard()
    .text(
      ctx.t("moderation-skip-comment-button", {
        status: "true",
      }),
      `moderation:comment:${requestId}`
    )
    .row()
    .text(ctx.t("back-button"), `moderation:view:${request._id}:current`);

  ctx.editMessageText(
    ctx.t("moderation-comment", {
      request_id: request.requestId || "-",
      from_name: request.requesterTG || request.viberRequester || "",
    }),
    {
      reply_markup: inlineKeyboard,
      disable_web_page_preview: true,
    }
  );
}

async function moderationComment(ctx: MyContext & { chat: Chat.PrivateChat }) {
  const fakeStatusTypes = {
    true: 1,
    fake: -1,
    reject: -2,
    noproof: -4,
    manipulation: -5,
  };

  const requestId = ctx.session.state.requestId;
  const comment = ctx?.message?.text;
  const fakeStatus = fakeStatusTypes[ctx.session.state.fakeStatus];

  const request = await ctx.database.Requests.findOne({
    _id: new mongoose.Types.ObjectId(requestId),
  });

  request.commentText = comment || "";
  request.fakeStatus = fakeStatus;
  request.moderation = ctx.from.id;
  await request.save();

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery({
      text: ctx.t("moderation-success", {
        request_id: request.requestId || "-",
      }),
      show_alert: true,
    });
  } else {
    await ctx.reply(
      ctx.t("moderation-success", {
        request_id: request.requestId || "-",
      })
    );
  }

  ctx.session.state.sub = "";

  return moderationView(ctx);
}

async function moderationSkipComment(
  ctx: MyContext & { chat: Chat.PrivateChat }
) {
  return moderationComment(ctx);
}

async function moderationStoped(ctx: MyContext) {
  ctx.session.state = {};

  return ctx.answerCallbackQuery({
    text: ctx.t("moderation-stopped"),
    show_alert: true,
  });
}

async function setup(bot: Bot<MyContext>) {
  const privateMessage = bot.filter(isPrivate);

  privateMessage.callbackQuery("start_work", startWork);
  privateMessage.callbackQuery("stop_work", stopWork);

  const moderation = bot.filter(isPrivate);

  moderation.callbackQuery(/(moderation):(view):(.*):(.*)/, moderationView);
  moderation.callbackQuery(/(moderation):(take):(.*)/, moderationTake);
  moderation.callbackQuery(
    /(moderation):(status):(.*):other/,
    moderationStatusOther
  );
  moderation.callbackQuery(/(moderation):(status):(.*):(.*)/, moderationStatus);
  moderation
    .filter((ctx) => ctx.session.state.sub === "comment")
    .on(":text", moderationComment);
  moderation.callbackQuery(/(moderation):(comment)/, moderationSkipComment);

  bot.callbackQuery(/(moderation):(.*)/, moderationStoped);
}

export default { setup };
