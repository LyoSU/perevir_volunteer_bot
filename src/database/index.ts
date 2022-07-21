import { NextFunction } from "grammy";
import { MyContext } from "../types";
import * as models from "./models";

function middleware(ctx: MyContext, next: NextFunction) {
  ctx.database = {
    Users: models.Users,
    Requests: models.Requests,
    Images: models.Images,
    Videos: models.Videos,
  };

  return next();
}

export default { middleware };
