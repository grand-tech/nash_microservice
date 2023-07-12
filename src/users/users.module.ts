import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';

import { CryptoWalletCreatorService } from './crypto-wallet-creator/crypto-wallet-creator.service';
import { DataTypesModule } from '../datatypes/datatypes.module';

@Module({
  imports: [DataTypesModule],
  providers: [UsersService, CryptoWalletCreatorService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}
