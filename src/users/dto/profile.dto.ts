export class Profile {
  [x: string]: import("/home/jamie/Code/Work/Nash/nash_microservice/src/users/dto/app_user.dto").AppUser;
  constructor(
    public readonly emailAddress: string,
    public readonly phoneNumber: string,
    public readonly isActive: boolean,
    public readonly isBlocked: boolean,
    public readonly isDeleted: boolean,
    public readonly createdOn: Date,
    public readonly updatedOn: Date,
    public readonly uid?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly id?: string,
  ) {}

  public static fromJSON(json: any): Profile {
    return new Profile(
      json.emailAddress,
      json.phoneNumber,
      json.isActive,
      json.isBlocked,
      json.isDeleted,
      json.createdOn,
      json.updatedOn,
      json.uid,
      json.firstName,
      json.lastName,
      json.id,
    );
  }

  public static toJSON(profile: Profile): any {
    return {
      emailAddress: profile.emailAddress,
      phoneNumber: profile.phoneNumber,
      isActive: profile.isActive,
      isBlocked: profile.isBlocked,
      isDeleted: profile.isDeleted,
      createdOn: profile.createdOn,
      updatedOn: profile.updatedOn,
      uid: profile.uid,
      firstName: profile.firstName,
      lastName: profile.lastName,
      id: profile.id,
    };
  }
}
