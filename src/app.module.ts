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
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    UsersModule,
    UtilsModule,
    Neo4jModule.forRoot({
      scheme: 'neo4j+s',
      host: 'd5ae9814.databases.neo4j.io',
      username: 'neo4j',
      password: '2WTLSBf6xAdoLN_4SD-L_JF3ATH7_ahUaMspIqjVFRw',
      port: 7687,
      database: 'neo4j',
    }),
    DataTypesModule,
    TransactionsModule,
  ],
  providers: [],
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
