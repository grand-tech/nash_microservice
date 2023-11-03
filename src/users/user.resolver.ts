import { Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from '../utils/response';
import { User } from '../datatypes/user/user';
import { Role, Roles } from '../utils/pre-auth/roles';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export default class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation((returns) => UserResponse)
  async signUp(
    @Args({ name: 'feduid', type: () => String })
    @Req()
    request,
  ): Promise<UserResponse> {
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

  @Mutation((returns) => UserResponse)
  @Roles(Role.User)
  async createNewCryptoWallet(
    @Args('feduid') feduid: string,
    @Context() context,
  ): Promise<UserResponse> {
    const user: User = context.req.raw.user as User;
    return await this.userService.createCryptoAccount(user);
  }

  @Mutation((returns) => UserResponse)
  @Roles(Role.User)
  async addPrivateKeyToAccount(
    @Args('privateKey') privateKey: string,
    @Context() context,
  ): Promise<UserResponse> {
    const user: User = context.req.raw.user as User;
    return await this.userService.addPrivateKeyToAccount(user, privateKey);
  }

  @Mutation((returns) => UserResponse)
  @Roles(Role.User)
  async addMnemonicToAccount(
    @Args('mnemonic') mnemonic: string,
    @Context() context,
  ): Promise<UserResponse> {
    const user: User = context.req.raw.user as User;
    return await this.userService.addMnemonicToAccount(user, mnemonic);
  }

  @Mutation((returns) => UserResponse)
  @Roles(Role.User)
  async saveUserProfile(
    @Args('phoneNumber') phoneNumber: string,
    @Args('fullName') fullName: string,
    @Context() context,
  ): Promise<UserResponse> {
    const user: User = context.req.raw.user as User;
    return await this.userService.saveUserProfile(user, phoneNumber, fullName);
  }

  @Query((returns) => [User])
  async getUsers() {
    return [];
  }
}
