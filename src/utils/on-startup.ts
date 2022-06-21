import { UserFromGetMe } from "grammy/out/platform.node";
import bot from "../bot";

import logger from "./logger";
import handlers from "../handlers";
import middlewares from "../middlewares";
import transformers from "../transformers";
import botCommands from "./bot-commands";

async function onStartup(botInfo: UserFromGetMe): Promise<void> {
  logger.info("Setting up the bot...");

  await botCommands.setup(bot);

  await transformers.setup(bot);

  await middlewares.setup(bot);

  await handlers.setup(bot);

  logger.info("Starting the bot");
  console.log(botInfo);
}

export default onStartup;
