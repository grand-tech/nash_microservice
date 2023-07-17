import { Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'src/utils/response';
import { Request } from 'express';
import { User } from 'src/datatypes/user/user';
import { Role, Roles } from '../utils/pre-auth/roles';

@Controller('')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('/signup')
  async signUp(@Req() request: Request): Promise<Response> {
    const user: User = {
      feduid: request['feduid'] ?? '',
      email: request['firebaseUser']?.email ?? '',
      phoneNumber: request['firebaseUser']?.phoneNumber ?? '',
      name: '',
      idNumber: undefined,
      publicAddress: '',
      id: undefined,
      labels: [],
      privateKey: '',
      publicKey: '',
      mnemonic: '',
    };

    return await this.userService.validateNewUser(user);
  }

  @Get('/createnewcryptowallet')
  @Roles(Role.User)
  async createNewCryptoWallet(@Req() request: Request): Promise<Response> {
    const user: User = request['user'];
    return await this.userService.createCryptoAccount(user);
  }

  @Post('/add-privatekey-to-account')
  @Roles(Role.User)
  async addPrivateKeyToAccount(@Req() request: Request): Promise<Response> {
    const user: User = request['user'];
    const body = request.body;
    return await this.userService.addPrivateKeyToAccount(user, body.privateKey);
  }

  @Post('/add-mnemonic-to-account')
  @Roles(Role.User)
  async addMnemonicToAccount(@Req() request: Request): Promise<Response> {
    const user: User = request['user'];
    const body = request.body;

    return await this.userService.addMnemonicToAccount(user, body.mnemonic);
  }

  @Post('/save-user-profile')
  @Roles(Role.User)
  async saveUserProfile(@Req() request: Request): Promise<Response> {
    const user: User = request['user'];
    const body = request.body;

    return await this.userService.saveUserProfile(
      user,
      body.phoneNumber,
      body.fullName,
    );
  }
}
