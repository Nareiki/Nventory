import { Module } from '@nestjs/common';
import { ArticleTransactionService } from './article-transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleTransaction } from 'src/entities/article-transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleTransaction])],
  exports: [TypeOrmModule],
  providers: [ArticleTransactionService]
})
export class ArticleTransactionModule { }
