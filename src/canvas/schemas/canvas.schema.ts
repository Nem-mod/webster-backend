import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Canvas extends Document {
  @Prop({ required: true })
  canvasName: string;

  @Prop({ required: true })
  resolution: [number, number];

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  canvas: object;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const CanvasSchema = SchemaFactory.createForClass(Canvas);
