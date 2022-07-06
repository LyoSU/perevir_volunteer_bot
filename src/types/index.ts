import { Context as BaseContext, Api, SessionFlavor } from "grammy";
import { HydrateFlavor, HydrateApiFlavor } from "@grammyjs/hydrate";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { User } from "../database/models/users";
import mongoose from "mongoose";

interface SessionData {
  user: User;
  state: { [key: string]: any };
  data: any;
}

interface DatabaseFlavor {
  database: { [key: string]: mongoose.Model<any, any> };
}

interface UserFlavor {
  user: any;
}

type MyContext = BaseContext &
  HydrateFlavor<BaseContext> &
  SessionFlavor<SessionData> &
  FluentContextFlavor &
  DatabaseFlavor &
  UserFlavor;
type MyApi = HydrateApiFlavor<Api>;

export { MyContext, MyApi, SessionData };
