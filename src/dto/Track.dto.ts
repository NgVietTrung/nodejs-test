import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  artistId: string;

  @IsOptional()
  @IsString()
  albumId: string;
}

export class UpdateTrackDto extends CreateTrackDto {}
