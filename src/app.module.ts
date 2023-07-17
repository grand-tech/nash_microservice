import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';
import { PreAuthMiddleware } from './utils/pre-auth/pre-auth.middleware';
import { Neo4jModule } from 'nest-neo4j/dist';
import { DataTypesModule } from './datatypes/datatypes.module';

@Module({
  imports: [
    UsersModule,
    UtilsModule,
    Neo4jModule.forRoot({
      scheme: 'neo4j+s',
      host: '5991cc59.databases.neo4j.io',
      username: 'neo4j',
      password: 'E5WWlP7pTcYuCQaVGF29nAF4ytmmO_HSs3kFOrK8n_g',
      port: 7687,
      database: 'neo4j',
    }),
    DataTypesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // configure pre-auth middleware to app.
    consumer.apply(PreAuthMiddleware).forRoutes({
      path: '/*',
      method: RequestMethod.ALL,
    });
  }
}
