import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class SendFundsService {
  constructor(private readonly neo4j: Neo4jService) {}
}
