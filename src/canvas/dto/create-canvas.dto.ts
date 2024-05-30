import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateCanvasDto {
  @IsString()
  @IsNotEmpty()
  canvasName: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  resolution: [number, number];

  @IsObject()
  @IsDefined()
  canvas: object;
}
