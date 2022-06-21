import { Bot, session } from "grammy";
import { logger } from "../utils";
import { MyContext, SessionData } from "../types";
import { hydrateContext } from "@grammyjs/hydrate";

import loggingUpdates from "./logging";
import { i18n } from "./i18n";

async function setup(bot: Bot<MyContext>) {
  logger.info("Setting up middlewares...");

  bot.use(loggingUpdates);
  bot.use(hydrateContext());

  function initial(): SessionData {
    return {
      user: null,
      phoneNumber: null,
    };
  }
  bot.use(session({ initial }));

  bot.use(i18n());
}

export default { setup };
