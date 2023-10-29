import { Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from '../utils/response';
import { User } from '../datatypes/user/user';
import { Role, Roles } from '../utils/pre-auth/roles';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export default class UserResolver {
  constructor(private readonly userService: UsersService) { }

  @Mutation(returns => UserResponse)
  async signUp(@Args({ name: 'feduid', type: () => String }) @Req() request): Promise<UserResponse> {
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

  @Query(returns => [User])
  async getUsers() {
    return []
  }

  // @Mutation(returns => User)
  // @Roles(Role.User)
  // async createNewCryptoWallet(@Req() request: Request): Promise<Response<User>> {
  //   const user: User = request['user'];
  //   return await this.userService.createCryptoAccount(user);
  // }

  // @Post('/add-privatekey-to-account')
  // @Roles(Role.User)
  // async addPrivateKeyToAccount(@Req() request: Request): Promise<Response> {
  //   const user: User = request['user'];
  //   const body = request.body;
  //   return await this.userService.addPrivateKeyToAccount(user, body.privateKey);
  // }

  // @Post('/add-mnemonic-to-account')
  // @Roles(Role.User)
  // async addMnemonicToAccount(@Req() request: Request): Promise<Response> {
  //   const user: User = request['user'];
  //   const body = request.body;

  //   return await this.userService.addMnemonicToAccount(user, body.mnemonic);
  // }

  // @Post('/save-user-profile')
  // @Roles(Role.User)
  // async saveUserProfile(@Req() request: Request): Promise<Response> {
  //   const user: User = request['user'];
  //   const body = request.body;

  //   return await this.userService.saveUserProfile(
  //     user,
  //     body.phoneNumber,
  //     body.fullName,
  //   );
  // }
}
