import { Context as BaseContext, Api, SessionFlavor } from "grammy";
import { HydrateFlavor, HydrateApiFlavor } from "@grammyjs/hydrate";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { User } from "../database/models/user.schema";

interface SessionData {
  user: User;
  phoneNumber: string;
}

type MyContext = BaseContext &
  HydrateFlavor<BaseContext> &
  SessionFlavor<SessionData> &
  FluentContextFlavor;
type MyApi = HydrateApiFlavor<Api>;

export { MyContext, MyApi, SessionData };
