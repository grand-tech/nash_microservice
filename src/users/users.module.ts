import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DataTypesModule } from '../datatypes/datatypes.module';
import UserResolver from './user.resolver';

@Module({
  imports: [DataTypesModule],
  providers: [UsersService, UserResolver],
  exports: [UsersService, UserResolver],
  controllers: [],
})
export class UsersModule {}
