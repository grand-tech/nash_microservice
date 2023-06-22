import { Module } from '@nestjs/common';
import { User } from './user/user';
import { userInfo } from 'os';
import BaseNode from './base-node';

@Module({
  exports: [User, userInfo, BaseNode],
})
export class DataTypesModule {}
