import { Module } from "@nestjs/common";
import { TransactionDDBModule } from "./Transaction/transaction.ddb.module";

@Module({
  imports: [
    TransactionDDBModule,
  ]
})
export class ApiDDBModule {}
