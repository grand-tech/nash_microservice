import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CryptoWalletCreatorService } from './crypto-wallet-creator.service';
import { DataTypesModule } from '../datatypes/datatypes.module';
import UserResolver from './user.resolver';

@Module({
  imports: [DataTypesModule],
  providers: [UsersService, CryptoWalletCreatorService, UserResolver],
  exports: [UsersService, UserResolver],
  controllers: [],
})
export class UsersModule {}
