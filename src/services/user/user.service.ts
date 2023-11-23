import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InjectRepository,
  ArangoRepository,
  ResultList,
  ArangoNewOldResult,
} from 'nest-arango';
import { UserEntity } from '../../entities/user/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: ArangoRepository<UserEntity>,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<ResultList<UserEntity>> {
    return await this.userRepository.findAll();
  }

  async findOne(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ username });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(
    username: string,
    updatedUser: Partial<UserEntity>,
  ): Promise<ArangoNewOldResult<any>> {
    // Find the existing user
    const existingUser = await this.userRepository.findOneBy({ username });

    if (!existingUser) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    // Update the user fields
    Object.assign(existingUser, updatedUser);

    // Use the `update` method to persist changes
    const updatedDocument = await this.userRepository.update(existingUser);

    // Return the updated user
    return updatedDocument ? updatedDocument : null;
  }

  async remove(username: string): Promise<void> {
    await this.userRepository.removeBy({ username });
  }
}
