import { prop, getModelForClass, mongoose } from "@typegoose/typegoose";

export class Video {
  @prop()
  _id: mongoose.Types.ObjectId;

  @prop()
  telegramFileId: string;

  @prop()
  telegramUniqueFileId: string;

  @prop()
  fileSize: number;

  @prop()
  width: number;

  @prop()
  height: number;

  @prop()
  video: {
    data: Buffer;
    contentType: string;
  };

  @prop()
  request: mongoose.Types.ObjectId;

  @prop()
  createdAt: Date;
}

export const Videos = getModelForClass(Video);
