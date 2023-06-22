import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { DataTypesModule } from '../../src/datatypes/datatypes.module';

@Module({
  imports: [DataTypesModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}
