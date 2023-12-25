import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Collection('Users')
export class UserEntity extends ArangoDocument {
  @ApiProperty({ description: 'user id', example: '1' })
  @IsString()
  user_id?: string;

  @ApiProperty({ description: 'username', example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'password', example: '1234562' })
  @IsString()
  password: string;
}
