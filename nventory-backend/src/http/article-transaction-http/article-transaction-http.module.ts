import { Module } from '@nestjs/common';
import { ArticleTransactionModule } from 'src/core/article-transaction/article-transaction.module';
import { ArticleTransactionService } from 'src/core/article-transaction/article-transaction.service';
import { ArticleTransactionController } from './article-transaction.controller';

@Module({
    imports: [ArticleTransactionModule],
    providers: [ArticleTransactionService],
    controllers: [ArticleTransactionController]
})
export class ArticleTransactionHttpModule { }
