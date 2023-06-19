import { Module } from '@nestjs/common';

@Module({})
export class UtilsModule {}

export interface User {
    id: number,
    name: string,
    email: string,
    phoneNumber: string,
    feduid: string
}