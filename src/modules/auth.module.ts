import { ArangoModule } from 'nest-arango';
import { UserEntity } from '../entities/user/user.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ArangoModule.forRoot({
      config: {
        url: 'http://localhost:8529',
        databaseName: 'arangodb_pishgaman',
        auth: { username: 'Azim', password: 'azim1383' },
      },
    }),
    ArangoModule.forFeature([UserEntity]),
  ],
})
export class AuthModule {}
