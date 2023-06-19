import { Injectable } from '@nestjs/common';
import { User } from 'src/utils/utils.module';

@Injectable()
export class UsersService {

    /**
     * 
     */
    private readonly users: Array<User> = [
        {
            name: "John Doe",
            email: "johndoe@gamil.com",
            feduid: "rwer873423rn2",
            id: 1,
            phoneNumber: "+254791725651"
        },
        {
            name: "Jane Doe",
            email: "janedoe@gamil.com",
            feduid: "rwer873423rn3",
            id: 2,
            phoneNumber: "+254791725653"
        }
    ]

    /**
     * Finds a user given the id.
     * @param id the user id.
     * @returns the found user.
     */
    async findOne(id: number) {
        return this.users.find(user => user.id === id)
    }
}
