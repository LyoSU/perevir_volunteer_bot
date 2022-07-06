import { NextFunction } from "grammy";
import { User, Users } from "../database/models/users";
import { MyContext } from "../types";

export const userUpdateMiddleware = async (
  ctx: MyContext,
  next: NextFunction
) => {
  const { from } = ctx;

  let params: Partial<User> = {
    telegram_id: from.id,
    first_name: from.first_name,
    last_name: from.last_name,
    username: from.username,
    language_code: from.language_code,
    last_activity_at: new Date(),
    is_blocked: false,
    is_deactivated: false,
  };
  try {
    const user = await Users.findOneAndUpdate(
      { telegram_id: from.id },
      { $set: params },
      { upsert: true, new: true }
    );

    ctx.user = user;
  } catch (error) {
    console.error("Error user", error);
    ctx.user = null;
  }

  return next().then(() => {
    if (ctx.user) {
      ctx.user.last_activity_at = new Date();
      return ctx.user.save();
    }
  });
};
