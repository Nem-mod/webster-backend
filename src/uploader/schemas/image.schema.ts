import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Image extends Document {
  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ required: true })
  saved: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: null })
  user: User;

  // TODO: connect to canvas
}

export const ImageSchema = SchemaFactory.createForClass(Image);
