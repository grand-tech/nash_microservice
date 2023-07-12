import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { DataTypesModule } from '../../src/datatypes/datatypes.module';
import { CryptoWalletCreatorService } from './crypto-wallet-creator/crypto-wallet-creator.service';

@Module({
  imports: [DataTypesModule],
  providers: [UsersService, CryptoWalletCreatorService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}
