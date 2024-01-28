import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFileArgs {
  @IsNotEmpty()
  @IsString()
  key: string;
}
