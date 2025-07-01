import { Module } from '@nestjs/common';
import { ArticleTransactionService } from './article-transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleTransaction } from 'src/entities/article-transactions.entity';
import { Article } from 'src/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleTransaction, Article])],
  exports: [TypeOrmModule],
  providers: [ArticleTransactionService]
})
export class ArticleTransactionModule { }
