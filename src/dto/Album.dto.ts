import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsOptional()
  artistId: string;
}

export class UpdateAlbumDto extends CreateAlbumDto {}
