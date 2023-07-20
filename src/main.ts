import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeContractKit } from './utils/block-chain-utils/contract.kit.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // make sure that the contract kit utils are initialized.
  initializeContractKit();

  await app.listen(3000);
}
bootstrap();
