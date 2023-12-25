import { Collection, ArangoDocument } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Users')
export class UserEntity extends ArangoDocument {
  @ApiProperty({ description: 'user id', example: '1' })
  user_id?: string;

  @ApiProperty({ description: 'username', example: 'john_doe' })
  username: string;

  @ApiProperty({ description: 'password', example: '1234562' })
  password: string;
}
