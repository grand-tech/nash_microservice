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
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { DB_CONNECTIONS_CONFIGS } from './db.config';

@Module({
  imports: [
    UsersModule,
    UtilsModule,
    Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS),
    DataTypesModule,
    TransactionsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      include: [UsersModule, TransactionsModule],
      sortSchema: true,
    }),
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
