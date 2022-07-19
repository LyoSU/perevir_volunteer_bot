import { Bot } from "grammy";
import { MyContext } from "../../types";
import { logger } from "../../utils";

import cabinet from "./cabinet";
import message from "./message";
import moderation from "./moderation";
import myRequests from "./my-requests";
import faq from "./faq";

async function setup(bot: Bot<MyContext>) {
  logger.info("Setting up command handlers...");

  await cabinet.setup(bot);
  await moderation.setup(bot);
  await myRequests.setup(bot);
  await faq.setup(bot);
  await message.setup(bot);
}

export default { setup };
