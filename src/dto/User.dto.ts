import { Length, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  login: string;

  @Length(7, 12)
  @IsString()
  password: string;
}

export class UpdatePasswordDto {
  @IsString()
  @Length(6, 12)
  oldPassword: string;

  @Length(6, 12)
  @IsString()
  newPassword: string;
}
