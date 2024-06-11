import { IsNotEmpty, IsString } from 'class-validator';

export class SearchUnsplashImageDto {
  @IsString()
  @IsNotEmpty()
  search: string;
}
