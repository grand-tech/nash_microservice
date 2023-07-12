import { Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'src/utils/response';
import { Request } from 'express';
import { User } from 'src/datatypes/user/user';

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
      mnemonic: ''
    };

    return await this.userService.validateNewUser(user);
  }
}
