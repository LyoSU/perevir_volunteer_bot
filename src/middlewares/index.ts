import { Bot, session } from "grammy";
import { logger } from "../utils";
import { MyContext, SessionData } from "../types";
import { hydrateContext } from "@grammyjs/hydrate";

import database from "../database";

import loggingUpdates from "./logging";
import { i18n } from "./i18n";
import { userUpdateMiddleware } from "./user-update";
import { checkAuthorization } from "./check-auth";

async function setup(bot: Bot<MyContext>) {
  logger.info("Setting up middlewares...");

  bot.use(loggingUpdates);
  bot.use(hydrateContext());

  function initial(): SessionData {
    return {
      user: undefined,
      state: {},
      data: {},
    };
  }
  bot.use(session({ initial }));

  bot.use(i18n());

  bot.use(database.middleware);
  bot.use(userUpdateMiddleware);
  bot.use(checkAuthorization);
}

export default { setup };
