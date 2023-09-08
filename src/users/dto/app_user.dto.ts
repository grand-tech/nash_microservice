export class AppUser {
  constructor(
    public readonly uid: string,
    private readonly emailAddress: string,
    private readonly phoneNumber: string,
    private readonly password: string,
    private readonly isActive: boolean,
    public readonly isDeleted: boolean,
    public readonly isBlocked: boolean,
    public readonly createdOn: Date,
    public readonly updatedOn: Date,
  ) {}

  public static fromJSON(json: any): AppUser {
    return new AppUser(
      json.uid,
      json.emailAddress,
      json.phoneNumber,
      json.password,
      json.isActive,
      json.isDeleted,
      json.isBlocked,
      json.createdOn,
      json.updatedOn,
    );
  }

  public static toJSON(appUser: AppUser): any {
    return {
      uid: appUser.uid,
      emailAddress: appUser.emailAddress,
      phoneNumber: appUser.phoneNumber,
      password: appUser.password,
      isActive: appUser.isActive,
      isDeleted: appUser.isDeleted,
      isBlocked: appUser.isBlocked,
      createdOn: appUser.createdOn,
      updatedOn: appUser.updatedOn,
    };
  }
}
