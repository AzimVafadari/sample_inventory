import { Collection, ArangoDocument, BeforeSave } from 'nest-arango';
import { ApiProperty } from '@nestjs/swagger';

@Collection('Users')
export class UserEntity extends ArangoDocument {
  @ApiProperty({ description: 'username', example: 'john_doe' })
  username: string;
  @ApiProperty({ description: 'password', example: 'john_doe' })
  password: string;
  @ApiProperty({ description: 'email', example: 'example@gmail.com' })
  email?: string;
  @ApiProperty({
    description: 'role of the user',
    example: 'admin or subAdmin',
  })
  role?: string;
  created_at?: Date;
  updated_at?: Date;

  @BeforeSave()
  beforeSave() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
