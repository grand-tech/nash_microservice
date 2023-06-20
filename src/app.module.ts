import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';
import { PreAuthMiddleware } from './utils/pre-auth/pre-auth.middleware';

@Module({
  imports: [AuthModule, UsersModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    // configure pre-auth middleware to app.
    consumer.apply(PreAuthMiddleware).forRoutes(
      {
        path: '/*',
        method: RequestMethod.ALL
      }
    )
  }
}
