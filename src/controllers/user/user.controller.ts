import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { UserEntity } from '../../entities/user/user.entity';
import { ArangoNewOldResult, ResultList } from 'nest-arango';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiOperation({
    summary: 'ایجاد کاربر',
    requestBody: { description: 'string', content: null, required: true },
  })
  async create(@Body() user: UserEntity): Promise<UserEntity> {
    return await this.userService.create(user);
  }

  @Get()
  @ApiOperation({
    summary: 'دریافت تمام کاربران',
  })
  async findAll(): Promise<ResultList<UserEntity>> {
    return await this.userService.findAll();
  }

  @Get(':username')
  @ApiOperation({
    summary: 'دریافت کاربر با نام کاربری',
  })
  async findOne(
    @Param('username') username: string,
  ): Promise<UserEntity | null> {
    return await this.userService.findOne(username);
  }

  @Put(':username')
  @ApiOperation({
    summary: 'ویرایش کاربر',
    requestBody: { description: 'string', content: null, required: true },
  })
  async update(
    @Param('username') username: string,
    @Body() user: UserEntity,
  ): Promise<ArangoNewOldResult<any>> {
    return await this.userService.update(username, user);
  }

  @Delete(':username')
  @Put(':username')
  @ApiOperation({
    summary: 'حذف کاربر',
  })
  async remove(@Param('username') username: string): Promise<void> {
    return await this.userService.remove(username);
  }
}
