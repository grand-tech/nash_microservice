import { Module } from '@nestjs/common';
import { User } from './user/user';
import BaseNode from './base-node';

@Module({
  imports: [User, BaseNode],
  exports: [User, BaseNode],
})
export class DataTypesModule {}
