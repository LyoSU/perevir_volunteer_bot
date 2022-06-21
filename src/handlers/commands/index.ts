import { Bot } from "grammy";
import { MyContext } from "../../types";
import { logger } from "../../utils";
import start from "./start";
import message from "./message";

async function setup(bot: Bot<MyContext>) {
  logger.info("Setting up command handlers...");
  await start.setup(bot);
  await message.setup(bot);
}

export default { setup };
