import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Canvas extends Document {
  @Prop({ required: true })
  canvasName: string;

  @Prop({ required: true })
  resolution: [number, number];

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  canvas: object;
}

export const CanvasSchema = SchemaFactory.createForClass(Canvas);
