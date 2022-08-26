import { prop, getModelForClass } from "@typegoose/typegoose";
import {ObjectId} from "mongoose";

export class Moderator {
  @prop()
  _id: ObjectId;
  @prop({ required: true, unique: true, index: true })
  public telegramID!: number;
  @prop()
  public name?: string;
  @prop()
  requests: [{ type: ObjectId, ref: 'Requests' }];
  @prop()
  public lastAction?: Date;
  @prop()
  public createdAt?: Date;
}

export const Moderators = getModelForClass(Moderator, {
  schemaOptions: {
    timestamps: {
      createdAt: "created_at",
    },
  },
});
