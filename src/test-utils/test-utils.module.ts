import { Module } from '@nestjs/common';
import { FirebaseTestUtilsService } from './firebase-test-utils/firebase-test-utils.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FirebaseTestUtilsService],
  exports: [FirebaseTestUtilsService],
})
export class TestUtilsModule {}
