import { prop, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";

export class Request {
  [x: string]: any;
  @prop()
  _id: ObjectId;

  @prop()
  requestId: number;

  @prop()
  viberReq: boolean;

  @prop()
  viberRequester: string;

  @prop()
  viberMediaUrl: string;

  @prop()
  requesterTG: number;

  @prop()
  requesterId: string;

  @prop()
  requesterMsgID: number;

  @prop()
  moderatorMsgID: number;

  @prop()
  moderatorActionMsgID: number;

  @prop()
  moderator: string;

  @prop()
  takenModerator: number;

  @prop()
  needUpdate: boolean;

  @prop()
  takenAt: Date;

  @prop()
  otherUsetsTG: [
    {
      requesterTG: number;
      requesterId: string;
      requesterMsgID: number;
    }
  ];

  @prop()
  telegramForwardedChat: number;

  @prop()
  telegramForwardedMsg: number;

  @prop()
  telegramPhotoId: string;

  @prop()
  image: [string];

  @prop()
  video: [string];

  @prop()
  text: string;

  @prop()
  searchPhrase: string;

  @prop()
  tags: [string];

  @prop()
  commentChatId: number;

  @prop()
  commentMsgId: number;

  @prop()
  commentText: string;

  @prop()
  fakeStatus: {
    type: number;
    default: 0;
  }; //Request Fake status: 0 - uncertain, 1 - not fake, -1 - fake, -2 - rejected, -3 - auto reject, 2 - auto confirm

  @prop()
  requestReason: number;

  @prop()
  lastUpdate: Date;

  @prop()
  createdAt: Date;
}

export const Requests = getModelForClass(Request, {
  schemaOptions: {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
});
